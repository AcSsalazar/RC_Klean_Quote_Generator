from django.contrib import admin
from userauths.models import User,Profile

class UserAdmin(admin.ModelAdmin):
    search_fields  = ['full_name', 'username', 'email',  'phone']
    list_display  = ['username', 'email', 'phone', 'city', 'address', 'zip_code', 'business_type']

class ProfileAdmin(admin.ModelAdmin):
    search_fields  = ['user']
    list_display = ['user', 'full_name']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
