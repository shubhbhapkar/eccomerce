# commerece/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Product,Category,Cart,Test,ProductColor,CustomUser,VendorKYC

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
           'username','email', 'name', 'phone_number',
            'address',
             'password1', 'password2','is_vendor'

        ]

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            email=validated_data['email'],
            name=validated_data['name'],
            
            phone_number=validated_data['phone_number'],
            address=validated_data['address'],
            is_vendor=validated_data['is_vendor']
            
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']  # Only return the 'name' field or any other fields you need

class ProductColorSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()  # Using SerializerMethodField

    class Meta:
        model = ProductColor
        fields = ['color', 'image_url']

    def get_image_url(self, obj):
        # Ensure that the image URL is correctly fetched
        if obj.image:
            return obj.image.url  # Return the image URL
        return None


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    product_colors = ProductColorSerializer(many=True)  # Add the ProductColor details

    class Meta:
        model = Product
        fields = ['id', 'productname',  'productbrand', 'price', 'discount', 'category', 'discounted_price', 'product_colors','rating','description','stock_quantity']
        
    def get_discounted_price(self, obj):
        # Calculate and return the discounted price
        return obj.discounted_price()
    
    def get_image_url(self, obj):
        # Return the URL of the image associated with the color
        return obj.image.url if obj.image else None
    


class Productgetserilizer(serializers.ModelSerializer):
    category = CategorySerializer()  # Include category fields in the product serializer
    product_colors = ProductColorSerializer(many=True)  # Add the ProductColor details

    class Meta:
        model = Product
        fields = ['id', 'productname', 'image', 'productbrand', 'price', 'discount', 'category', 'discounted_price', 'product_colors','rating']
        
    def get_discounted_price(self, obj):
        # Calculate and return the discounted price
        return obj.discounted_price()
    
    def get_image_url(self, obj):
        # Return the URL of the image associated with the color
        return obj.image.url if obj.image else None

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['added_at']


class CartlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = Cart
        fields = '__all__'
        
class Testserilizer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'

class Categoryseri(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class profilesearilizer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','first_name','last_name','email','phone_number','address']


class profileEdit(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields =  ['id','username','first_name','last_name','email','phone_number','address']

# serializers.py
from rest_framework import serializers

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    subject = serializers.CharField()
    message = serializers.CharField()


class KycForm(serializers.ModelSerializer):
    class Meta:
        model = VendorKYC
        fields = ['name',  'business_name', 'business_address', 'phone_no','tax_id_number', 'gst_vat_registration', 'pan_card', 'adhar_card','bank_account_holder_name', 'account_number', 'bank_code' ]

class GetKycStatus(serializers.ModelSerializer):
    class Meta:
        model = VendorKYC
        fields = ['status']


from rest_framework import serializers
from .models import ProductColor

class SProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ['color', 'image']

from rest_framework import serializers
from .models import Product

class SProductSerializer(serializers.ModelSerializer):
    product_colors = SProductColorSerializer(many=True)
   
    class Meta:
        model = Product
        fields = ['user', 'productname', 'productbrand', 'description', 'price', 'category', 'stock_quantity', 'rating', 'discount', 'product_colors']

    def create(self, validated_data):
    # Pop product colors from validated data
        colors_data = validated_data.pop('product_colors')
        # Create the product with the logged-in user (retrieved from context)
        product = Product.objects.create(**validated_data, user=self.context['request'].user)
        # Create associated ProductColor objects
        for color_data in colors_data:
            ProductColor.objects.create(product=product, **color_data)
        return product
    
    def update(self, instance, validated_data):
        # Update product fields
        instance.productname = validated_data.get('productname', instance.productname)
        instance.productbrand = validated_data.get('productbrand', instance.productbrand)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
       
        instance.stock_quantity = validated_data.get('stock_quantity', instance.stock_quantity)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.discount = validated_data.get('discount', instance.discount)

        # Save updated product
        instance.save()

        # Handle product_colors updates (add, update, or remove)
        colors_data = validated_data.get('product_colors', [])
        existing_colors = {color.id: color for color in instance.product_colors.all()}  # Map existing colors by their ID

        # Add or update colors
        for color_data in colors_data:
            color_id = color_data.get('id')
            if color_id:
                # Update existing color
                color_instance = existing_colors.get(color_id)
                if color_instance:
                    color_instance.color = color_data.get('color', color_instance.color)
                    color_instance.image = color_data.get('image', color_instance.image)
                    color_instance.save()
                    del existing_colors[color_instance.id]  # Remove updated color from existing_colors
            else:
                # Create new color
                ProductColor.objects.create(product=instance, **color_data)

        # Delete colors that are no longer included in the request
        for remaining_color in existing_colors.values():
            remaining_color.delete()

        return instance
    

from rest_framework import serializers
from .models import Order, OrderItem, Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)  # Accept product ID from the request

    class Meta:
        model = OrderItem
        fields = ['product_id', 'quantity']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)  # Accept multiple items in the request

    class Meta:
        model = Order
        fields = ['status', 'items','address','payment_method','id']

    def create(self, validated_data):
        user = self.context['request'].user  # Get the logged-in user
        items_data = validated_data.pop('items')

        
        

        # Add items to the order
        for item_data in items_data:
            product_id = item_data['product_id']
            quantity = item_data['quantity']

            # Fetch the product and validate stock
            try:
                product = Product.objects.get(id=product_id)
                if product.stock_quantity < quantity:
                    raise serializers.ValidationError(f"Insufficient stock for product {product.productname}.")
                else:
                    order1 = Order.objects.create(user=user, **validated_data)
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist.")

            # Deduct stock and create the OrderItem
            product.stock_quantity -= quantity
            product.save()

            OrderItem.objects.create(
                order=order1,
                product=product,
                quantity=quantity
            )
            representation = super().to_representation(order1)
        
            representation['order_id'] = order1.id
        return representation

from .models import Feedback
class Checkout(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['address','payment_method']

class Feedbackseri(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['order','feedback']


class ProductSerializerhell(serializers.ModelSerializer):

    product_colors = ProductColorSerializer(many=True,read_only=True)  # Add the ProductColor details

    class Meta:
        model = Product
        fields = ['id', 'productname',  'productbrand', 'price', 'discount', 'discounted_price', 'product_colors','rating','description','stock_quantity']
        
    def get_discounted_price(self, obj):
        # Calculate and return the discounted price
        return obj.discounted_price()
    
    def get_image_url(self, obj):
        # Return the URL of the image associated with the color
        return obj.image.url if obj.image else None
    

class OrderStatus(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status','shipping']
