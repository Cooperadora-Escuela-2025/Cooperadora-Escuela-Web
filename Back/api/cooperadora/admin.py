from django.contrib import admin
from .models import  ComprobantePago, Order, OrderProduct, Product, Profile


admin.site.register(Profile)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderProduct)
admin.site.register(ComprobantePago)