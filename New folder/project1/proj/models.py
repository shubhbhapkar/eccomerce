from django.db import models
import math
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=30, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.CharField(max_length=255, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_vendor = models.BooleanField(default=False,blank=False)
    



class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='category_products' ,null=True,blank=True)
    def __str__(self):
        return self.name

class ProductColor(models.Model):
    product = models.ForeignKey('Product', related_name='product_colors', on_delete=models.CASCADE)
    color = models.CharField(max_length=50)
    image = models.ImageField(upload_to='product_colors/',null=True,blank=True)

    def __str__(self):
        return f"{self.product.productname} - {self.color}"

class Product(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="user_products", default=25)
    productname = models.CharField(max_length=100)
    productbrand = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    stock_quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    discount = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0.00)



    def discounted_price(self):
        return math.floor(self.price - (self.discount * self.price / 100))  # Always rounds down

    
    def __str__(self):
        return self.productname

class Cart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="cart_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')


class Test(models.Model):
    names = models.CharField(max_length=250)
    titile = models.CharField(max_length=150)



class VendorKYC(models.Model):
    status_choices = {
        "verified":"verified",
        "pending":"pending",
        "declined":"declined"

    }
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name="kyc")
    status = models.TextField(choices=status_choices,max_length=10,default="pending")
    name = models.CharField(max_length=255)
    business_name = models.CharField(max_length=255)
    business_address = models.TextField()
    phone_no = models.CharField(max_length=255)

   
    tax_id_number = models.CharField(max_length=255)
    gst_vat_registration = models.CharField(max_length=255)
    
    pan_card = models.FileField(upload_to='kyc/government_id/')
    adhar_card = models.FileField(upload_to='kyc/address_proof/')

    bank_account_holder_name = models.CharField(max_length=255)
    account_number = models.CharField(max_length=255)
    bank_code = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def save(self, *args, **kwargs):
        if self.status == 'declined' and self.pk:  
           
            self.delete()
        else:
            super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.business_name}"


from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = [
        ("APPROVED","Approved"),
        ("PENDING", "Pending"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]
    SHIPPING_CHOICES = [
        ("THIRDPARTY","Thirdparty"),
        ("SELF-FULLFILMENT","Self-fullfilment")
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,  related_name="orders")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="APPROVED")
    address = models.TextField(max_length=250,default="",null=True)
    payment_method = models.CharField(max_length=250,default="",null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping = models.CharField(max_length=20,choices=SHIPPING_CHOICES,default="THIRDPARTY")

    def __str__(self):
        return f"Order #{self.id} by {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name="items"
    )
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    

    def __str__(self):
        return f"{self.quantity} x {self.product.productname} for Order #{self.order.id}"

    @property
    def total_price(self):
       
        return self.quantity * self.product.discounted_price()

class Feedback(models.Model):
    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    feedback = models.CharField(max_length=500)

