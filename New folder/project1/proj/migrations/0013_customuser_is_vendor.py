# Generated by Django 5.1.3 on 2024-11-29 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proj', '0012_remove_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_vendor',
            field=models.BooleanField(default=False),
        ),
    ]
