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
    service_type = ServiceTypeSerializer()
    facility_type = FacilityTypeSerializer()
    area_size = AreaSizeSerializer()
    cleaning_frequency = CleaningFreqSerializer()
    toilets_number = ToiletsQtySerializer()
    start_date = StartDateSerializer()
    hiring_likelihood = HiringLikelihoodSerializer()

    class Meta:
        model = ClientQuestionnaire
        fields = '__all__'
        read_only_fields = ['user', 'created_at']