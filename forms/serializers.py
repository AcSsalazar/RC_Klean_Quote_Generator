from rest_framework import serializers
from .models import ClientQuestionnaire, HiringLikelihood, StartDateOption, ServiceType, FacilityType, AreaSize, CleaningFreq, ToiletsQty


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = ['id', 'name']
     

class FacilityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacilityType
        fields = ['id', 'name']

class AreaSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaSize
        fields = ['id', 'description']


class CleaningFreqSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningFreq
        fields = ['id', 'description']

class ToiletsQtySerializer(serializers.ModelSerializer):
    class Meta:
        model = ToiletsQty
        fields = ['id', 'description']


class StartDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartDateOption
        fields = ['id', 'description']


class HiringLikelihoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = HiringLikelihood
        fields = ['id', 'description']


class ClientQtSerializer(serializers.ModelSerializer):
    service_type = serializers.PrimaryKeyRelatedField(queryset=ServiceType.objects.all())
    facility_type = serializers.PrimaryKeyRelatedField(queryset=FacilityType.objects.all())
    area_size = serializers.PrimaryKeyRelatedField(queryset=AreaSize.objects.all())
    cleaning_frequency = serializers.PrimaryKeyRelatedField(queryset=CleaningFreq.objects.all())
    toilets_number = serializers.PrimaryKeyRelatedField(queryset=ToiletsQty.objects.all())
    start_date = serializers.PrimaryKeyRelatedField(queryset=StartDateOption.objects.all())
    hiring_likelihood = serializers.PrimaryKeyRelatedField(queryset=HiringLikelihood.objects.all())

    class Meta:
        model = ClientQuestionnaire
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


    def get_user_display(self, obj):
        if obj.user:
            return obj.user.email  # Muestra el email del usuario registrado
        return f"Anonymous_{obj.id:02}"  # Muestra "Anonymous_0X" para usuarios anónimos
