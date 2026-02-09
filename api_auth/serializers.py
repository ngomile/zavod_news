from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    '''
    Serializer for the User model.'''

    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'is_staff',
            'is_superuser',
            'password',
        ]

    def create(self, validated_data):
        '''
        Create and return a new user instance, given the validated data.
        '''
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
