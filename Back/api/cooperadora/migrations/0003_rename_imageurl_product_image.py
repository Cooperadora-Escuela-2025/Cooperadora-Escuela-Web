# Generated by Django 5.1.5 on 2025-01-31 00:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cooperadora', '0002_alter_product_imageurl'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='imageUrl',
            new_name='image',
        ),
    ]
