from rest_framework import serializers
from .models import ComprobantePago, Cuota, Order, OrderProduct, Product, Purchase, Reservation, ReservationProduct, User,Profile

# serializer usuario
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
        }

# serializer perfil
class ProfileSerializer(serializers.ModelSerializer):
# Campos del modelo User
    first_name = serializers.CharField(source='user.first_name')  
    last_name = serializers.CharField(source='user.last_name')    
    email = serializers.EmailField(source='user.email', read_only=True)  

    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'dni', 'shift', 'grade_year', 'telephone']
        read_only_fields = ['user', 'email']  
        extra_kwargs = {
            'dni': {'required': False},
            'shift': {'required': False},
            'grade_year': {'required': False},
            'telephone': {'required': False},
        }
        

    def update(self, instance, validated_data):
        user = instance.user
        user_data = validated_data.pop('user', {})

        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
            user.save()

    # actualizar los campos del modelo Profile 
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance
        
            
# serializer producto      
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'quantity']


# serializer ordenproducto
class OrderProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())  # Usar PrimaryKeyRelatedField

    class Meta:
        model = OrderProduct
        fields = ['product', 'unit_price', 'quantity']

# serializer orden      
class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'name', 'surname', 'dni', 'total', 'payment_method', 'products']

    def validate(self, data):
        # Validar stock para cada producto antes de crear la orden
        for item in data['products']:
            product = item['product']
            quantity = item['quantity']

            if product.quantity < quantity:
                raise serializers.ValidationError({
    "products": [f"Sin stock suficiente para {product.name} (stock disponible: {product.quantity})"]
})
        return data

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        order = Order.objects.create(**validated_data)

        for product_data in products_data:
            product = product_data['product']
            quantity = product_data['quantity']

            # Descontar stock
            product.quantity -= quantity
            product.save()

            # Crear relación
            OrderProduct.objects.create(
                order=order,
                product=product,
                unit_price=product_data['unit_price'],
                quantity=quantity
            )

        return order

    
# serializer tramite
# class ProcedureSerializer(serializers.ModelSerializer):
#     procedure_type_display = serializers.CharField(source='get_procedure_type_display', read_only=True)

#     class Meta:
#         model = Procedure
#         fields = '__all__'
#         read_only_fields = ['user', 'request_date']
        
        
# serializer para admin
class AdminUserCreationSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("El email ya está registrado.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')  
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user)
        return user
    

class CuotaSerializer(serializers.ModelSerializer):
    mes_display = serializers.SerializerMethodField()
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = Cuota
        fields = [
            'id', 'tipo', 'tipo_display', 'mes', 'mes_display',
            'anio', 'monto', 'pagado', 'fecha_pago', 'fecha_creacion'
        ]
        read_only_fields = ['id', 'monto', 'pagado', 'fecha_pago', 'fecha_creacion']

    def get_mes_display(self, obj):
        return dict(Cuota.MESES_CHOICES).get(obj.mes, '') if obj.mes else ''
    

# comprobante de cuota
class ComprobantePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprobantePago
        fields = '__all__'
        read_only_fields = ('user',)
        
        
#historial de compras    
class PurchaseSerializer(serializers.ModelSerializer):
    order = OrderSerializer()
    created_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = Purchase
        fields = ['id', 'order', 'created_at']
        
#reserva de productos 
class ReservationProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ReservationProduct
        fields = ['product', 'product_name', 'quantity']

class ReservationSerializer(serializers.ModelSerializer):
    items = ReservationProductSerializer(many=True, write_only=True)
    items_read = ReservationProductSerializer(source='reservationproduct_set', many=True, read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'reserved_for_date', 'notes', 'items', 'items_read']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
    
    # Extraer y quitar 'user' si está en validated_data
        user = self.context['request'].user
        validated_data.pop('user', None)

        reservation = Reservation.objects.create(user=user, **validated_data)

        for item in items_data:
            ReservationProduct.objects.create(reservation=reservation, **item)

        return reservation


