from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ClientQuestionnaire, ServiceType, FacilityType, AreaSize, CleaningFreq, ToiletsQty, StartDateOption, HiringLikelihood
from .serializers import (
    ClientQtSerializer,
    ServiceTypeSerializer,
    FacilityTypeSerializer,
    AreaSizeSerializer,
    CleaningFreqSerializer,
    ToiletsQtySerializer,
    StartDateSerializer,
    HiringLikelihoodSerializer
)

# Vista para enviar los datos del cuestionario
class QuestionnaireSubmitView(APIView):
    def post(self, request):
        # Establecer el usuario como None si no está autenticado
        user = request.user if request.user.is_authenticated else None

        serializer = ClientQtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)  # Asignar el usuario (o None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Errores del serializador:", serializer.errors)  # Log para depuración
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para obtener opciones del cuestionario
class QuestionnaireOptionsView(APIView):
    def get(self, request):
        # Recuperar y serializar datos de opciones
        data = {
            "service_types": ServiceTypeSerializer(ServiceType.objects.all(), many=True).data,
            "facility_types": FacilityTypeSerializer(FacilityType.objects.all(), many=True).data,
            "area_sizes": AreaSizeSerializer(AreaSize.objects.all(), many=True).data,
            "cleaning_freqs": CleaningFreqSerializer(CleaningFreq.objects.all(), many=True).data,
            "toilet_qtys": ToiletsQtySerializer(ToiletsQty.objects.all(), many=True).data,
            "start_dates": StartDateSerializer(StartDateOption.objects.all(), many=True).data,
            "hiring_likelihoods": HiringLikelihoodSerializer(HiringLikelihood.objects.all(), many=True).data,
        }
        return Response(data, status=status.HTTP_200_OK)

# Vista para obtener el detalle de un cuestionario específico
class QuestionnaireDetailView(APIView):
    def get(self, request, pk):
        try:
            questionnaire = ClientQuestionnaire.objects.get(pk=pk)
        except ClientQuestionnaire.DoesNotExist:
            return Response({"error": "Cuestionario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ClientQtSerializer(questionnaire)
        return Response(serializer.data, status=status.HTTP_200_OK)
