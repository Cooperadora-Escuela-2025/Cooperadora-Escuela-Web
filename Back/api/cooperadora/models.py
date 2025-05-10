from django.db import models
from django.contrib.auth.models import User

# definicion de modelo perfil
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # rol = models.CharField(max_length=10, choices=RolEnum.choices, default=RolEnum.USUARIO)
    dni = models.CharField(max_length=20,blank=True, null=True)
    shift  = models.CharField(max_length=20,blank=True, null=True)#turno
    grade_year = models.CharField(max_length=20,blank=True, null=True)#curso/año
    telephone = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"Perfil de {self.user.first_name} {self.user.last_name}"
    
    
# definicion de modelo producto
class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    
    def __str__(self):
        return f"Producto: {self.name}, Precio: ${self.price}, Imagen: {self.image}"



# Definición del modelo Order
class Order(models.Model):
    PAYMENT_METHODS = [
        ('efectivo', 'Efectivo'),
        ('mercadopago', 'Mercado Pago'),
    ]

    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    dni = models.CharField(max_length=20)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='efectivo')
    products = models.ManyToManyField(Product, through='OrderProduct')

    def __str__(self):
        products_list = ", ".join([op.product.name for op in self.orderproduct_set.all()])  # Accede a los productos a través de OrderProduct
        return f"Orden: {self.name} {self.surname}, DNI: {self.dni}, Total: ${self.total}, Productos: {products_list}"  # Paréntesis de cierre añadido


# Definición del modelo OrderProduct
class OrderProduct(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE)  # Relación con Order
    product = models.ForeignKey('Product', on_delete=models.CASCADE)  # Relación con Product
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)  # Precio unitario
    quantity = models.PositiveIntegerField()  # Cantidad

    def __str__(self):
        return f"{self.product.name} - ${self.unit_price} x {self.quantity}"
    
    
# definicion de modelo tramite
class Procedure(models.Model):
    PROCEDURE_TYPE_CHOICES = [
        ('certificate', 'Certificado de estudiante Regular'),
        ('reincorporation', 'Reincorporación'),
        ('exam_board', 'Mesa de Examen'),
        ('other', 'Otro'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    procedure_type = models.CharField(max_length=50, choices=PROCEDURE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pendiente') 

    def __str__(self):
        return f"{self.user.username} - {self.procedure_type}"