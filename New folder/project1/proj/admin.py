from django.contrib import admin
from .models import Product, ProductColor,Category,CustomUser,VendorKYC,Order


class ReadOnlyCat(admin.ModelAdmin):
    def has_add_permission(self, request):
        """Disable add functionality."""
        return False

    def has_change_permission(self, request, obj=None):
        """Disable change functionality."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Disable delete functionality."""
        return False

class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1  


class ReadOnlyAdmin(admin.ModelAdmin):
    inlines = [ProductColorInline]
    
    def has_add_permission(self, request):
        """Disable add functionality."""
        return False

    def has_change_permission(self, request, obj=None):
        """Disable change functionality."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Disable delete functionality."""
        return False
    
# class DeleteOnlyUser(admin.ModelAdmin):
#     def has_add_permission(self, request, obj=None):
#         return False
#     def has_change_permission(self, request, obj = None):
#         return False
    

admin.site.register(Product)
admin.site.register(Category,ReadOnlyCat)
admin.site.register(CustomUser)
admin.site.register(VendorKYC)
admin.site.register(Order)

