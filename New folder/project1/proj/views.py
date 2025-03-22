from rest_framework import generics, status,permissions
from rest_framework.response import Response
from .serializers import CustomUserSerializer,ProductSerializer,Productgetserilizer,CartSerializer,CartlistSerializer,Testserilizer,Categoryseri,profilesearilizer,profileEdit,ContactSerializer,KycForm,GetKycStatus
from rest_framework.views import APIView
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login,logout
from .models import Product,Category,Cart,CustomUser,Test,VendorKYC,ProductColor
from rest_framework.permissions import IsAuthenticated
from .permissions import IsVendor
from django.db.models import Q
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from django.core import paginator
from rest_framework.pagination import PageNumberPagination


class CustomUserRegistrationView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"user": serializer.data},
            status=status.HTTP_201_CREATED
        )

class SessionLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Use Django's built-in AuthenticationForm to handle validation
        form = AuthenticationForm(data=request.data)
        
        if form.is_valid():
            # Authenticate the user
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
            print(user.is_vendor,"user is vendor")
            
            if user is not None:
                # Log the user in using Django's session system
                login(request, user)
                return Response({'message': 'Login successful','username': user.username,'is_vendor':user.is_vendor}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': form.errors}, status=status.HTTP_400_BAD_REQUEST)


 
from django.views.decorators.csrf import csrf_exempt

class SessionLogoutView(APIView):
    permission_classes= [IsAuthenticated]  # Disables CSRF protection for this view
    def post(self, request):
        logout(request)
        request.session.flush()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10  # Default number of items per page
    page_size_query_param = 'page_size'  # Allow clients to set page size via query param
    max_page_size = 10 

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    pagination_class = CustomPageNumberPagination

class getProducts(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'



class ProductsByCategoryView(APIView):
    
    def get(self, request, category_name, format=None):
        # Find the category by name
        try:
            category = Category.objects.get(name=category_name)
            print(request.user,"logged in user")
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Find all products with the given category
        products = Product.objects.filter(category=category)
        
        # Serialize the products
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    


# views.py


class CartListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, username, format=None):
        # Find the category by name
        try:
            
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Find all products with the given category
        mycart = Cart.objects.filter(user=user)
        print("hello",request.user)
        # Serialize the products
        serializer = CartlistSerializer(mycart, many=True)
        return Response(serializer.data)
    

class CartCreateView(generics.CreateAPIView):
    serializer_class = CartSerializer
    
    def post(self, request, *args, **kwargs):
        product_id = request.data.get("product")
        
        quantity = request.data.get("quantity", 1)
        user_id = request.data.get("user")
       

       
        try:
            # Convert quantity to an integer
            quantity = int(quantity)
        except ValueError:
            return Response({"error": "Quantity must be a valid integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            user1 = CustomUser.objects.get(username=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "user not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if(product.stock_quantity>0):
            cart_item, created = Cart.objects.get_or_create(
                user=user1,
                product=product,
                defaults={"quantity": quantity}
            )
            
            if not created:
                cart_item.quantity = cart_item.quantity+quantity
                cart_item.save()
            
            product.stock_quantity -= 1
            product.save()
            return Response({"message": "Item added to cart", "quantity": cart_item.quantity}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "product out of stock"})

class testview(generics.CreateAPIView):
    queryset = Test.objects.all()
    serializer_class = Testserilizer


class deletecart(generics.DestroyAPIView):
    queryset = Cart.objects.all()
    lookup_field = "id"

    def destroy(self, request, *args, **kwargs):
        # Retrieve the cart instance to be deleted
        instance = self.get_object()

        # Get the associated product and quantity
        product = instance.product
        quantity = instance.quantity

        # Update the product's stock quantity
        product.stock_quantity += quantity
        product.save()

        # Delete the cart instance
        self.perform_destroy(instance)

        return Response({"message": "Cart item deleted, stock quantity updated"}, status=status.HTTP_200_OK)



class Viewcategories(generics.ListAPIView):
   
    queryset = Category.objects.all()
    serializer_class = Categoryseri
    


class SearchProductView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        # Retrieve the search term from the URL's query parameters
        search_term = self.request.query_params.get('q', '').strip('"')
        

        # Filter products by checking if the search term is contained in the productname, category, or description
        queryset = Product.objects.filter(
            Q(productname__icontains=search_term) |
            Q(category__name__icontains=search_term) |  # Assuming category is a ForeignKey with a 'name' field
            Q(description__icontains=search_term)
        )

        return queryset


class Profile(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = profilesearilizer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieves the current logged-in user object
        return self.request.user


class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = profilesearilizer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Returns the current logged-in user
        return self.request.user
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    

# views.py



class ContactAPIView(generics.CreateAPIView):
    serializer_class = ContactSerializer
  
    def perform_create(self,serializer):
    
        if serializer.is_valid():
           
            name = serializer.validated_data['name']
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']

            email_message = EmailMultiAlternatives(
            subject=subject,
            body=message,  # No plain text body (empty)
            from_email='shubhambhapkar0@gmail.com',
            to=['shubhambhapkar0@gmail.com'],
        )
            email_message.send()
            
            return Response(
                {"message": "Data received successfully!", "data": serializer.validated_data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"detail": "CSRF cookie set"})


from django.contrib.auth.views import PasswordResetView
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.core.mail import EmailMultiAlternatives

class CustomPasswordResetView(PasswordResetView):
    email_template_name = 'emailex.html'

    def send_mail(self, subject_template_name, email_template_name, context, from_email, to_email, html_email_template_name=None):
        """
        Overriding send_mail to send only HTML emails (no plain text).
        """
        # Render the subject from the subject template
        subject = render_to_string(subject_template_name, context).strip()

        # Render the HTML email content using the provided template
        html_content = render_to_string(email_template_name, context)

        # Create the email message object
        email_message = EmailMultiAlternatives(
            subject=subject,
            body='',  # No plain text body (empty)
            from_email=from_email,
            to=[to_email],
        )

        # Explicitly set the content type to HTML
        email_message.content_subtype = "html"

        # Attach the HTML content as the only content (no plain text version)
        email_message.attach_alternative(html_content, "text/html")

        # Send the email
        email_message.send()

import json
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_decode
from proj.models import CustomUser  # Import your CustomUser model

def reset_password(request, uid, token):
    try:
        # Decode the `uid` to get the user ID (use `CustomUser`)
        uid = urlsafe_base64_decode(uid).decode()
        user = get_object_or_404(CustomUser, pk=uid)  # Use CustomUser here
    except (ValueError, CustomUser.DoesNotExist):
        return JsonResponse({'error': 'Invalid user ID or token'}, status=400)

    # Check the token
    if not default_token_generator.check_token(user, token):
        return JsonResponse({'error': 'Invalid token'}, status=400)

    # Process the password reset if it's a POST request
    if request.method == 'POST':
        data = json.loads(request.body)
        new_password1 = data.get('new_password1')
        new_password2 = data.get('new_password2')

        # Check if passwords match
        if new_password1 and new_password1 == new_password2:
            user.set_password(new_password1)
            user.save()
            return JsonResponse({'success': 'Password has been reset successfully.'})
        else:
            return JsonResponse({'error': 'Passwords do not match.'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)





def CartCount(request):

    user1 =request.user
    
    if user1.is_authenticated:
        cart_count = Cart.objects.filter(user=user1).count()
        print(user1,cart_count)
    else:
        cart_count = 0
    print(cart_count)
    return JsonResponse({'cart_count': cart_count})



class Kyc(generics.CreateAPIView):
    queryset = VendorKYC.objects.all()
    serializer_class = KycForm
    permission_classes = [IsAuthenticated,IsVendor]

    def create(self, request, *args, **kwargs):
       serializer = self.get_serializer(data= request.data)
       serializer.is_valid(raise_exception = True)
       serializer.save(user=request.user)
       return Response({"message":"kyc created successfuly wait for reply" ,"data":serializer.data})
        

class GetKycStatus(generics.RetrieveAPIView):
    queryset = VendorKYC
    serializer_class = GetKycStatus
    permission_classes = [IsAuthenticated,IsVendor]

    def get_object(self):
        try:   
            kyc = VendorKYC.objects.get(user=self.request.user) 
            return kyc
        except VendorKYC.DoesNotExist:
            return Response({"message":False})


from django.http import JsonResponse
from .models import Product,Feedback

def summary_api(request):
    try:
        products_count = Product.objects.filter(user=request.user).count()
        print(products_count,"products_count")
        products = Product.objects.filter(user=request.user)


        orders_count = Order.objects.filter(
        items__product__in=products).distinct().count()
        print(orders_count,"orders_count")
        orders = Order.objects.filter(items__product__in=products).distinct()
        feedbacks_count = Feedback.objects.filter(order__in=orders).distinct().count()
        print(feedbacks_count,"feedbackcount")

        # Return the counts as JSON
        return JsonResponse({
            "message": "Summary fetched successfully",
            "data": {
                "productsCount": products_count,
                "ordersCount": orders_count,
                "feedbacksCount": feedbacks_count
            }

        })
    except Exception as e:
        print(e)
        return JsonResponse({
            "data": {
                "productsCount": 0,
                "ordersCount": 0,
                "feedbacksCount": 0
            },
           
        }, status=500)
       


from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product, ProductColor
from .serializers import SProductSerializer, SProductColorSerializer,ProductSerializerhell
from django.utils.decorators import method_decorator

class CreateProductWithColorsView(generics.CreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated,IsVendor]
    serializer_class = SProductSerializer




class GetVendorProducts(generics.ListAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated,IsVendor]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(user=self.request.user).order_by('-id')
    
class RetriveVedorProducts(generics.RetrieveAPIView,generics.DestroyAPIView,):
    queryset = Product.objects.all()
    serializer_class = ProductSerializerhell
    lookup_field = 'id'

class UpdateVedorProducts(generics.UpdateAPIView):
    queryset = Product.objects.all()

    serializer_class = SProductSerializer
    lookup_field = 'id'


from rest_framework import generics
from .models import Order,OrderItem
from .serializers import OrderCreateSerializer,Checkout

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = OrderCreateSerializer

    def get_queryset(self):
        # Restrict to orders created by the logged-in user
        return self.queryset.filter(user=self.request.user)
    
class Checkout(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = Checkout  # Assuming `CheckoutSerializer` is defined

    def create(self, request, *args, **kwargs):
      
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

      
        order = serializer.save(user=request.user) 

        
        cart = Cart.objects.filter(user=request.user)

      
        for cart_item in cart:
            OrderItem.objects.create(
                order=order,  
                product=cart_item.product,
                quantity=cart_item.quantity
            )
            

        cart.delete()

        return Response({"message": "Order created successfully", "order_id": order.id}, status=201)

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Order, OrderItem

@login_required
def user_orders(request):
    user = request.user  # The logged-in user
    orders = Order.objects.filter(user=user).prefetch_related("items__product__product_colors").order_by('-id')

    # Serialize the data
    data = []
    for order in orders:
        order_data = {
            "id": order.id,
            "status": order.status,
            "address": order.address,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "shipping" :order.shipping,
            "items": [
                {
                    "product_name": item.product.productname,
                    "quantity": item.quantity,
                    "price": float(item.product.discounted_price()) if callable(item.product.discounted_price) else float(item.product.discounted_price),
                    "total_price": float(item.total_price()) if callable(item.total_price) else float(item.total_price),
                    "product_image": item.product.product_colors.first().image.url if item.product.product_colors.exists() else None,  # Accessing product's related ProductColor image
                }
                for item in order.items.all()
            ],
        }
        data.append(order_data)
    
    return JsonResponse({"orders": data}, safe=False)

@login_required
def vendor_orders(request):
    # Filter products by the logged-in vendor (assuming the vendor is the owner of the products)
    products = Product.objects.filter(user=request.user).select_related("user")

    # Precompute the order items related to the products for efficient querying
    order_items = OrderItem.objects.filter(product__in=products).select_related(
        "product", "product__product_colors"
    ).distinct()  # Ensure distinct order items

    # Fetch orders related to these order items, applying distinct to avoid duplicates
    orders = Order.objects.filter(items__in=order_items).prefetch_related(
        "items__product__product_colors"
    ).distinct()  # Ensure distinct orders

    # Serialize the data efficiently
    data = []
    for order in orders:
        order_data = {
            "user":order.user.username,
            "id": order.id,
            "status": order.status,
            "address": order.address,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
            "updated_at": order.updated_at,
            "shipping" :order.shipping,
            "items": [
                {
                    "product_name": item.product.productname,
                    "quantity": item.quantity,
                    "price": float(item.product.discounted_price()) if callable(item.product.discounted_price) else float(item.product.discounted_price),
                    "total_price": float(item.total_price()) if callable(item.total_price) else float(item.total_price),
                    "product_image": item.product.product_colors.first().image.url if item.product.product_colors.exists() else None,  # Accessing product's related ProductColor image
                }
                for item in order.items.all()
            ],
        }
        data.append(order_data)
    
    return JsonResponse({"orders": data}, safe=False)

from .serializers import Feedbackseri
class GiveFeedback(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = Feedbackseri

    def create(self, request, *args, **kwargs):
        serializers = self.get_serializer(data= request.data)
        serializers.is_valid(raise_exception = True)

        serializers.save(user = request.user)

        return Response(serializers.data)
    
class Categorys(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = Categoryseri


from .serializers import OrderStatus
from rest_framework import generics
from rest_framework.response import Response
from .models import Order, OrderItem, Product
from .serializers import OrderStatus

class OrderStatuss(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderStatus
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        # Fetch the order being updated
        order = self.get_object()

        # If the order status is being updated to "CANCELLED"
        if request.data.get("status") == "CANCELLED":
            # Fetch the related order items
            order_items = OrderItem.objects.filter(order=order)

            # Loop through each order item and update the product stock quantity
            for order_item in order_items:
                product = order_item.product
                # Add the quantity back to the product's stock_quantity
                product.stock_quantity += order_item.quantity
                product.save()

        # Proceed with updating the order status as usual
        return super().update(request, *args, **kwargs)

@login_required
def feedback_api(request):
    try:
        # Get the products associated with the logged-in user
        products = Product.objects.filter(user=request.user)

        # Get the orders that contain these products
        orders = Order.objects.filter(items__product__in=products).distinct()

        # Get the feedbacks for those orders
        feedbacks = Feedback.objects.filter(order__in=orders).distinct()

        # Serialize feedback data
        feedback_list = [
            {
                "id": feedback.id,
                "user":feedback.user.username,
                "order_id": feedback.order.id,
                "feedback": feedback.feedback,
                
            }
            for feedback in feedbacks
        ]

        return JsonResponse({
            "data": {
                "feedbacks": feedback_list,
            }
        })

    except Exception as e:
        return JsonResponse({
            "error": "There is an error",
            "details": str(e) 
        }, status=500)