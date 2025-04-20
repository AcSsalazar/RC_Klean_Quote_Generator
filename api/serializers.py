from rest_framework import serializers
from .models import Invoice, Area, Equipment, BusinessType, AreaType, EquipmentType, FloorType, QuantityOption

class BusinessTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessType
        fields = ['id', 'name']


class QuantityOptionSerializer(serializers.ModelSerializer):
    equipment_type = serializers.PrimaryKeyRelatedField(read_only=True)
    option_type_display = serializers.CharField(source='get_option_type_display', read_only=True)
    option_value_display = serializers.CharField(source='get_option_value_display', read_only=True)

    class Meta:
        model = QuantityOption
        fields = ['id', 'equipment_type', 'option_type', 'option_type_display', 'option_value', 'option_value_display', 'price']
        #read_only_fields = ['option_type_display', 'option_value_display']

     

class AreaTypeSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = AreaType
        fields = ['id', 'name']

class EquipmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentType
        fields = ['id', 'name']



# Serializador para las áreas (Area)
class AreaSerializer(serializers.ModelSerializer):
    name = serializers.PrimaryKeyRelatedField(queryset=AreaType.objects.all())
    floor_type = serializers.PrimaryKeyRelatedField(queryset=FloorType.objects.all(), allow_null=True)

    class Meta:
        model = Area
        fields = ['name', 'square_feet', 'floor_type']


class FloorTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FloorType
        fields = ['id', 'name', 'price']

class EquipmentSerializer(serializers.ModelSerializer):
    name = serializers.PrimaryKeyRelatedField(queryset=EquipmentType.objects.all())
    option_type = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    option_value = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Equipment
        fields = ['name', 'quantity', 'option_type', 'option_value']


        

# Serializer for Invoice
class InvoiceSerializer(serializers.ModelSerializer):
    areas = AreaSerializer(many=True)
    equipment = EquipmentSerializer(many=True)
    business_type = serializers.PrimaryKeyRelatedField(queryset=BusinessType.objects.all())

    class Meta:
        model = Invoice
        fields = ['id', 'quote_id', 'business_type', 'areas', 'equipment', 
                  'total_price', 'full_name', 'city', 'zip_code', 'phone', 'address',
                  'email', 'created_at']

    def create(self, validated_data):
        areas_data = validated_data.pop('areas', [])
        equipment_data = validated_data.pop('equipment', [])
        
        # Create the invoice with all validated data (including full_name, email, etc.)
        invoice = Invoice.objects.create(**validated_data)

        # Create related areas
        for area_data in areas_data:
            Area.objects.create(invoice=invoice, **area_data)

        # Create related equipment
        for equip_data in equipment_data:
            Equipment.objects.create(invoice=invoice, **equip_data)

        return invoice

    def to_representation(self, instance):
        # For GET requests, return human-readable business_type name
        representation = super().to_representation(instance)
        representation['business_type'] = instance.business_type.name if instance.business_type else None
        return representation