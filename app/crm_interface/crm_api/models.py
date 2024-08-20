from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from datetime import date


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **other_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')

        user = self.model(email=self.normalize_email(email), **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # username = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    supervisors = models.ManyToManyField('self', symmetrical=False, related_name='subordinates')


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_all_subordinates(self):
        subordinates = set(self.subordinates.all())
        all_subordinates = set(subordinates)
        for subordinate in subordinates:
            all_subordinates.update(subordinate.get_all_subordinates())
        return all_subordinates

    def get_id(self):
        return self.id

    def get_name(self):
        return self.name

    def get_email(self):
        return self.email

    def __str__(self):
        return self.email


class Email(models.Model):
    subject = models.TextField()
    message = models.TextField()
    sender = models.EmailField(max_length=255)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    date_sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject


class TeamsChatMessage(models.Model):
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)
    teams_chat = models.ForeignKey('TeamsChat', related_name='messages', on_delete=models.CASCADE)

    def __str__(self):
        return self.message


class TeamsChat(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User)


    def __str__(self):
        return self.name


class TeamsDirectMessage(models.Model):
    message = models.TextField()
    sender = models.EmailField(max_length=255)
    receiver = models.ForeignKey(User, related_name='teams_direct_message_receiver', on_delete=models.CASCADE)
    date_sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message


class Meeting(models.Model):
    # TODO, the meeting belongs to only one user? also change get_meetings condition to get owned meetings?
    name = models.CharField(max_length=255)
    date = models.DateTimeField()
    place = models.TextField()
    participants = models.ManyToManyField(User)
    customers = models.ManyToManyField('Customer')
    description = models.TextField()
    owner = models.ForeignKey(User, related_name='owned_meetings', on_delete=models.SET_NULL, null=True)


    def __str__(self):
        return f'Meeting at {self.place} on {self.date}'


class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=15, null=True)
    address = models.TextField(null=True)

    def __str__(self):
        return self.name


class PartnerCompany(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, null=True)
    phone = models.CharField(max_length=15, null=True)
    address = models.TextField(null=True)
    customers = models.ManyToManyField(Customer)

    def __str__(self):
        return self.name

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    STATUS_CHOICES = [
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('In Review', 'In Review'),
        ('Done', 'Done'),
    ]

    title = models.CharField(max_length=255)
    estimated_time = models.IntegerField()
    spent_time = models.IntegerField(null=True)
    priority = models.CharField(max_length=6, choices=PRIORITY_CHOICES, default='Low')
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='To Do')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title
    

class Project(models.Model):
    name = models.CharField(max_length=255)
    creator = models.CharField(max_length=255)
    creatorId = models.ForeignKey(User, related_name='created_projects', on_delete=models.SET_NULL, null=True, blank=True)
    state = models.CharField(max_length=255)
    start_date = models.DateField(default=date.today)
    deadline = models.DateField(null=True)
    priority = models.CharField(max_length=255)
    assigned_to = models.ManyToManyField(User, related_name='assigned_projects')
    tasks = models.ManyToManyField(Task, related_name='project_tasks')
