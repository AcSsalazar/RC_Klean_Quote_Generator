from userauths.models import Profile, User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Define a custom serializer that inherits from TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''
    class MyTokenObtainPairSerializer(TokenObtainPairSerializer):: This line creates a new token serializer called MyTokenObtainPairSerializer that is based on an existing one called TokenObtainPairSerializer. Think of it as customizing the way tokens work.
    @classmethod: This line indicates that the following function is a class method, which means it belongs to the class itself and not to an instance (object) of the class.
    def get_token(cls, user):: This is a function (or method) that gets called when we want to create a token for a user. The user is the person who's trying to access something on the website.
    token = super().get_token(user): Here, it's asking for a regular token from the original token serializer (the one it's based on). This regular token is like a key to enter the website.
    token['full_name'] = user.full_name, token['email'] = user.email, token['username'] = user.username: This code is customizing the token by adding extra information to it. For example, it's putting the user's full name, email, and username into the token. These are like special notes attached to the key.
    return token: Finally, the customized token is given back to the user. Now, when this token is used, it not only lets the user in but also carries their full name, email, and username as extra information, which the website can use as needed.
    '''
    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token['nombre_completo'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        try:
            token['vendor_id'] = user.vendor.id
        except:
            token['vendor_id'] = 0

        # ...

        # Return the token with custom claims
        return token

# Define a serializer for user registration, which inherits from serializers.ModelSerializer
class RegisterSerializer(serializers.ModelSerializer):
    # Define fields for the serializer, including password and password2
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Specify the model that this serializer is associated with
        model = User
        # Define the fields from the model that should be included in the serializer
        fields = ('full_name', 'email', 'phone', 'password', 'password2', 'business_type', 'city', 'state')

    def validate(self, attrs):
        # Define a validation method to check if the passwords match
        if attrs['password'] != attrs['password2']:
            # Raise a validation error if the passwords don't match
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})

        # Return the validated attributes
        return attrs

    def create(self, validated_data):
        # Define a method to create a new user based on validated data
        user = User.objects.create(
            business_type=validated_data['business_type'],
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            phone=validated_data['phone'],
            city=validated_data['city'],
            state=validated_data['state'],
        )
        email_username, mobile = user.email.split('@')
        user.username = email_username

        # Set the user's password based on the validated data
        user.set_password(validated_data['password'])
        user.save()

        # Return the created user
        return user
    

class UserSerializer(serializers.ModelSerializer):
    business_type = serializers.CharField(source='business_type.name', default="No business type", allow_null=True)

    class Meta:
        model = User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    business_type = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'full_name', 'country', 'city', 'state', 'address', 'date', 'pid', 'user', 'business_type']

    # Unificación de business_type: Si no está en el perfil, se toma del usuario
    def get_business_type(self, obj):
        if obj.business_type:
            return obj.business_type.name
        elif obj.user.business_type:
            return obj.user.business_type.name
        return "No business type"

    # Personalización de la representación para incluir el usuario
    def to_representation(self, instance):
        response = super().to_representation(instance)
        # Incluir los datos del usuario serializado dentro del perfil
        response['user'] = UserSerializer(instance.user).data
        return response

    

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()