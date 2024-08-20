from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry

from .models import User, Email, TeamsChatMessage, Meeting, Customer, PartnerCompany, Project


@registry.register_document
class UserDocument(Document):
    id = fields.IntegerField(attr='id')
    name = fields.TextField(attr='name')
    email = fields.TextField(attr='email')

    class Index:
        name = 'users'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = User


@registry.register_document
class EmailDocument(Document):
    id = fields.IntegerField(attr='id')
    subject = fields.TextField(attr='subject')
    message = fields.TextField(attr='message')
    sender = fields.TextField(attr='sender')
    receiver = fields.ObjectField(properties={
        'name': fields.TextField(),
        'email': fields.TextField()
    })
    date_sent = fields.DateField(attr='date_sent')

    class Index:
        name = 'emails'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Email


@registry.register_document
class TeamsChatMessageDocument(Document):
    id = fields.IntegerField(attr='id')
    message = fields.TextField(attr='message')
    date_sent = fields.DateField(attr='date_sent')
    teams_chat = fields.ObjectField(properties={
        'name': fields.TextField(),
        'members': fields.NestedField(properties={
            'name': fields.TextField(),
            'email': fields.TextField()
        })
    })

    class Index:
        name = 'teams_chat_messages'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = TeamsChatMessage


@registry.register_document
class MeetingDocument(Document):
    id = fields.IntegerField(attr='id')
    name = fields.TextField(attr='name')
    date = fields.DateField(attr='date')
    place = fields.TextField(attr='place')
    description = fields.TextField(attr='description')
    participants = fields.NestedField(properties={
        'name': fields.TextField(),
        'email': fields.TextField()
    })

    class Index:
        name = 'meetings'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Meeting


@registry.register_document
class CustomerDocument(Document):
    id = fields.IntegerField(attr='id')
    name = fields.TextField(attr='name')
    email = fields.TextField(attr='email')
    phone = fields.TextField(attr='phone')
    company = fields.ObjectField(properties={
        'name': fields.TextField(),
        'address': fields.TextField()
    })

    class Index:
        name = 'customers'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Customer


@registry.register_document
class PartnerCompanyDocument(Document):
    id = fields.IntegerField(attr='id')
    name = fields.TextField(attr='name')
    address = fields.TextField(attr='address')
    phone = fields.TextField(attr='phone')
    email = fields.TextField(attr='email')

    class Index:
        name = 'partner_companies'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = PartnerCompany


@registry.register_document
class ProjectDocument(Document):
    id = fields.IntegerField(attr='id')
    name = fields.TextField(attr='name')
    creator = fields.TextField(attr='creator')
    creatorId = fields.ObjectField(properties={
        'name': fields.TextField(),
        'email': fields.TextField()
    })
    state = fields.TextField(attr='state')
    start_date = fields.DateField(attr='start_date')
    deadline = fields.DateField(attr='deadline')
    priority = fields.TextField(attr='priority')
    assigned_to = fields.NestedField(properties={
        'name': fields.TextField(),
        'email': fields.TextField()
    })

    class Index:
        name = 'projects'
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Project