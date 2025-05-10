from rest_framework import serializers
from .models import Order, OrderProduct, Procedure, Product, User,Profile

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
    first_name = serializers.CharField(source='user.first_name')  # Eliminado read_only=True
    last_name = serializers.CharField(source='user.last_name')    # Eliminado read_only=True
    email = serializers.EmailField(source='user.email', read_only=True)  # Solo lectura para email

    class Meta:
        model = Profile
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'dni', 'shift', 'grade_year', 'telephone']
        read_only_fields = ['user', 'email']  # 'user' y 'email' son solo lectura
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
        fields = '__all__'


# serializer ordenproducto
class OrderProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())  # Usar PrimaryKeyRelatedField

    class Meta:
        model = OrderProduct
        fields = ['product', 'unit_price', 'quantity']

# serializer orden      
class OrderSerializer(serializers.ModelSerializer):
    products = OrderProductSerializer(many=True)  # Usar OrderProductSerializer para los productos

    class Meta:
        model = Order
        fields = ['id', 'name', 'surname', 'dni', 'total', 'payment_method', 'products']

    def create(self, validated_data):
        products_data = validated_data.pop('products')  # Extraer los datos de los productos
        order = Order.objects.create(**validated_data)  # Crear la orden

        # Crear los OrderProduct asociados
        for product_data in products_data:
            OrderProduct.objects.create(order=order, **product_data)

        return order
    
    
# serializer tramite
class ProcedureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Procedure
        fields = '__all__'
        read_only_fields = ['user', 'request_date']