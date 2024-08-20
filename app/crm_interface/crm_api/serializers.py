from django.contrib.auth import authenticate
from rest_framework import serializers, viewsets
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Meeting, Customer, User, Email, PartnerCompany, Task, Project


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):

    # include the count of associtaed tasks that are actibe and total
    active_tasks = serializers.SerializerMethodField()
    total_tasks = serializers.SerializerMethodField()

    def get_active_tasks(self, obj):
        return obj.tasks.filter(status='In Progress').count()

    def get_total_tasks(self, obj):
        return obj.tasks.count()

    class Meta:
        model = Project
        fields = '__all__'


class MeetingSerializer(serializers.ModelSerializer):
    customers = CustomerSerializer(many=True)
    participants = UserSerializer(many=True)
    date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Meeting
        fields = '__all__'


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = '__all__'


class PartnerCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerCompany
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer()

    class Meta:
        model = Task
        fields = '__all__'