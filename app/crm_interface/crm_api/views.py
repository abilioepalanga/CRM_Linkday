import requests
from django.http import JsonResponse
from django.shortcuts import render
from elasticsearch_dsl import Q, Search
from rest_framework import viewsets
from django.shortcuts import render, get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from bs4 import BeautifulSoup

from .documents import UserDocument, EmailDocument, MeetingDocument, CustomerDocument, PartnerCompanyDocument, \
    ProjectDocument
from .models import *

from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import MeetingSerializer, UserSerializer, CustomerSerializer, EmailSerializer, \
    PartnerCompanySerializer
from .serializers import MeetingSerializer, UserSerializer, TaskSerializer, ProjectSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data['refresh']
        access = response.data['access']
        user = User.objects.get(email=request.data['email'])
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(access),
            'id': user.id,
            'name': user.name,
            'email': user.email,
        })



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_list(request):
    """
    List all projects.
    """
    projects = Project.objects.filter(assigned_to=request.user.id)
    serializer = ProjectSerializer(projects, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project(request, projectId):
    project = Project.objects.get(id=projectId)
    serializer = ProjectSerializer(project, many=False)
    users = project.assigned_to.all()
    user_serializer = UserSerializer(users, many=True)
    tasks = project.tasks.all()
    task_serializer = TaskSerializer(tasks, many=True)
    return JsonResponse({'project': serializer.data, 'users': user_serializer.data, 'tasks': task_serializer.data})


@api_view(['GET'])
@permission_classes([])
def get_project_users(request, projectId):
    project = Project.objects.get(id=projectId)
    users = project.assigned_to.all()
    serializer = UserSerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    data = request.data
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    project = Project.objects.create(
        name=data['name'],
        state=data['state'],
        priority=data['priority'],
        creator=user.name,
        creatorId=user,
        start_date=data['start_date'],
        deadline=data['deadline'],

    )
    project.assigned_to.add(user)
    for user_id in data['assigned_to']:
        user = User.objects.get(id=user_id)
        project.assigned_to.add(user)
    project.save()
    project_serializer = ProjectSerializer(project)
    return JsonResponse(project_serializer.data, safe=False)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_project(request):
    try:
        data = request.data
        project = Project.objects.get(id=data['id'])
        project.name = data.get('name', project.name)
        project.state = data.get('state', project.state)
        project.priority = data.get('priority', project.priority)
        project.save()
        return JsonResponse({'message': 'Project updated successfully'})
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_project_assignees(request):
    try:
        data = request.data
        project = Project.objects.get(id=data['id'])
        project.assigned_to.clear()
        for user_info in data['assigned_to']:
            print(user_info)
            user_email = user_info['email']
            user = User.objects.get(email=user_email)
            project.assigned_to.add(user)
        project.save()
        return JsonResponse({'message': 'Project updated successfully'})
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_project_tasks(request):
    try:
        data = request.data
        project = Project.objects.get(id=data['id'])
        project.tasks.clear()
        for task_info in data['tasks']:
            task_id = task_info['id']
            task = Task.objects.get(id=task_id)
            project.tasks.add(task)
        project.save()
        return JsonResponse({'message': 'Project updated successfully'})
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
          
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    return Response({'message': 'You are authenticated'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meetings(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    meetings = Meeting.objects.filter(participants__in=[user])

    # all_subordinates = user.get_all_subordinates()
    # for subordinate in all_subordinates:
    #     meetings = meetings | Meeting.objects.filter(participants__in=[subordinate])



    serializer = MeetingSerializer(meetings, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_meeting(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = request.data
    # set time to 3pm
    # split on T
    date = data['date'].split('T')[0]
    data['date'] = date + 'T15:00:00Z'
    print(data['date'])
    participant_emails = data['participants']
    meeting = Meeting.objects.create(
        owner=user,
        name=data['name'],
        date=data['date'],
        place=data['place'],
        description=data['description'],
    )
    meeting.participants.add(user)
    for email in participant_emails:
        participant = User.objects.get(email=email)
        meeting.participants.add(participant)
    meeting.save()
    return JsonResponse({'message': 'Meeting created successfully'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_meeting(request):
    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = request.data
    meeting = Meeting.objects.get(id=data['id'])
    if user not in meeting.participants.all():
        return JsonResponse({'message': 'You are not a participant of this meeting'}, status=403)
    meeting.name = data['name']
    meeting.date = data['date']
    meeting.place = data['place']
    meeting.description = data['description']
    meeting.save()
    return JsonResponse({'message': 'Meeting updated successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_other_users(request):
    user_id = request.user.id
    users = User.objects.exclude(id=user_id)
    serializer = UserSerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_tasks(request, status=None):
    if status:
        tasks = Task.objects.filter(status=status)
    else:
        tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_task(request):
    data = request.data
    user_email = data['assigned_to']
    user = User.objects.get(email=user_email)
    task = Task.objects.create(
        title=data['title'],
        estimated_time=data['estimated_time'],
        spent_time=data['spent_time'],
        priority=data['priority'],
        status=data['status'],
        assigned_to=user
    )
    task.save()
    serializer = TaskSerializer(task)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_task(request, task_id):
    data = request.data
    task = Task.objects.get(id=task_id)
    task.title = "CHANGED"
    task.estimated_time = data['estimated_time']
    task.spent_time = data['spent_time']
    task.priority = data['priority']
    task.status = data['status']
    task.save()
    serializer = TaskSerializer(task)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_task(request, task_id):
    task = Task.objects.get(id=task_id)
    task.delete()
    return JsonResponse({'message': 'Task deleted successfully'})



"""
The search functionality should be able to retrieve data from emails (even if mocks), project names and
 descriptions, meetings (title, place?, description), the Teams API (even if sample data),
  mock Teams Chats, clients, partners, colleagues, essentially search everywhere in the DB and 
  return the appropriate objects.

  Include the option for filtering by date, and by type of object (email, project, meeting, etc)
  Also include the option to sort by date, and by relevance.

"""


def match_messages(messages, query):
    matching_messages = []
    query = query.lower()
    for message in messages:
        if message.get('from') and query in message['from']['user']['displayName'].lower():
            matching_messages.append(message)
        elif message.get('body') and query in message['body']['content'].lower():
            matching_messages.append(message)
        elif message.get('summary') and query in message['summary'].lower():
            matching_messages.append(message)
        elif message.get('subject') and query in message['subject'].lower():
            matching_messages.append(message)
    return matching_messages


def search_teams_messages(query):
    headers = {
        "accept": "*/*",
        "accept-language": "pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "authorization": "Bearer {token:https://graph.microsoft.com/}",
        "content-type": "application/json",
        "prefer": "ms-graph-dev-mode",
        "priority": "u=1, i",
        "sdkversion": "GraphExplorer/4.0",
        "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
    }

    # This should depend on the user, but for now it is hardcoded with the sample data access token
    url = "https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats"
    response = requests.get(url, headers=headers)
    ids = []
    for chat in response.json()['value']:
        ids.append(chat['id'])

    responses = []
    # for every chat list the messages ordered by date. show also, if applicable the topic of the chat
    for chat_id in ids[:]:
        url = f"https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats%2F{chat_id}%2Fmessages"
        response = requests.get(url, headers=headers)
        responses.append(response.json())

    message_values = [message for response in responses for message in response['value']
                      if message['messageType'] == 'message']
    matching_messages = match_messages(message_values, query)
    #     if contentType is html, extract the text from it
    #     processed_messages = []
    include_fields = ['id', 'replyToId', 'createdDateTime',
                      'lastModifiedDateTime', 'lastEditedDateTime', 'deletedDateTime',
                      'subject', 'summary', 'chatId', 'importance', 'from', 'attachments',
                      'from', 'body', 'mentions']
    for message in matching_messages:
        message = {key: message[key] for key in include_fields}
        if message.get('body').get('contentType') == 'html':
            # extract the text from the html
            message['body']['content'] = BeautifulSoup(message['body']['content'], 'html.parser').get_text()
    return matching_messages


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    # use elastic search to search for the query in all the fields
    query = request.GET.get('q')
    filters = request.GET.get('filters')
    user = request.user
    sort = request.GET.get('sort')  # TODO

    # possible filters are: users, emails, meetings, messages, partners (and projects, ignore for now)
    # if no filters are provided, search in all types of documents and then return the document types accordingly
    # filters are separated by commas
    if filters:
        filters = filters.split(',')
    else:
        filters = ['users', 'emails', 'meetings', 'customers', 'partner_companies', 'projects']

    response = {}
    if 'users' in filters:
        q_users = Q('multi_match', query=query, fields=['name', 'email'], fuzziness='AUTO')
        searchUsers = UserDocument.search().query(q_users)
        response['users'] = searchUsers.execute().to_dict()

    if 'emails' in filters:
        q_emails = Q('multi_match', query=query, fields=['subject', 'message'], fuzziness='AUTO')
        searchEmails = EmailDocument.search().query(q_emails)
        response['emails'] = searchEmails.execute().to_dict()
        print(response['emails'])
    #     filter in only emails that are sent to, by the user or by sent or recieved by any subordinates
    #     emails = Email.objects.filter(Q(sender=user) | Q(receiver=user))


    if 'meetings' in filters:
        q_meetings = Q('multi_match', query=query, fields=['name', 'place', 'description'], fuzziness='AUTO')
        searchMeetings = MeetingDocument.search().query(q_meetings)
        response['meetings'] = searchMeetings.execute().to_dict()

    if 'customers' in filters:
        q_customers = Q('multi_match', query=query, fields=['name', 'email'], fuzziness='AUTO')
        searchCustomers = CustomerDocument.search().query(q_customers)
        response['customers'] = searchCustomers.execute().to_dict()

    if 'partners' in filters:
        q_partner_companies = Q('multi_match', query=query, fields=['name', 'email'], fuzziness='AUTO')
        searchPartnerCompanies = PartnerCompanyDocument.search().query(q_partner_companies)
        response['partner_companies'] = searchPartnerCompanies.execute().to_dict()

    if 'projects' in filters:
        q_projects = Q('multi_match', query=query, fields=['name'], fuzziness='AUTO')
        searchProjects = ProjectDocument.search().query(q_projects)
        response['projects'] = searchProjects.execute().to_dict()

    # if 'customers' in filters:
    q_customers = Q('multi_match', query=query, fields=['name', 'email'], fuzziness='AUTO')
    searchCustomers = CustomerDocument.search().query(q_customers)
    response['customers'] = searchCustomers.execute().to_dict()

    # serialize the objects and return them
    for key in response:
        response[key] = [item['_source'] for item in response[key]['hits']['hits']]

    # serialzers dictionary
    serializers = {
        'users': UserSerializer,
        'emails': EmailSerializer,
        'meetings': MeetingSerializer,
        'customers': CustomerSerializer,
        'partner_companies': PartnerCompanySerializer,
        'projects': ProjectSerializer
    }
    models = {
        'users': User,
        'emails': Email,
        'meetings': Meeting,
        'customers': Customer,
        'partner_companies': PartnerCompany,
        'projects': Project
    }

    # works without this, but maybe it is better to use the serializer to control only in one place the serialization
    for key in response:
        serializer = serializers[key]
        objects = [models[key].objects.get(id=item['id']) for item in response[key]]
        response[key] = serializer(objects, many=True).data

    # search in the teams messages
    if 'messages' in filters:
        # teams_messages = search_teams_messages(query)
        teams_messages = []
        response['teams_messages'] = teams_messages

    # iterate over the response[emails] and keep only the emails that are sent to the user or by the user
    # or sent or received by any of the user's subordinates
    if 'emails' in response:
        emails = response['emails']
        filtered_emails = []
        for email in emails:
            if email['sender'] == user.email or email['receiver'] == user.id:
                filtered_emails.append(email)
            else:
                for subordinate in user.get_all_subordinates():
                    if email['sender'] == subordinate.email or email['receiver'] == subordinate.id:
                        filtered_emails.append(email)
                        break
        response['emails'] = filtered_emails

    #     keep only th eprojects assigned to the user or to any of the user's subordinates
    if 'projects' in response:
        projects = response['projects']
        filtered_projects = []
        for project in projects:
            if user.id in project['assigned_to']:
                filtered_projects.append(project)
            else:
                for subordinate in user.get_all_subordinates():
                    if subordinate.id in project['assigned_to']:
                        filtered_projects.append(project)
                        break
        response['projects'] = filtered_projects

    return JsonResponse(response, safe=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reply_chatbot_message(request):
    import dateparser
    import spacy
    from date_spacy import find_dates
    from datetime import datetime, timedelta
    # Load your desired spaCy model
    nlp = spacy.blank('en')
    # Add the component to the pipeline
    nlp.add_pipe('find_dates')

    def calculate_next_weekday(day: str, lang='en'):
        day = day.lower()
        weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] if lang == 'en' else [
            'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo']
        today = datetime.today()
        current_weekday = today.weekday()
        days_ahead = weekdays.index(day) - current_weekday
        if days_ahead <= 0:
            days_ahead += 7
        return today + timedelta(days=days_ahead)

    def interpret_command(command, lang='pt'):
        keywords = ['schedule', 'meeting', 'create', 'new', 'titled'] if lang == 'en' else ['agendar', 'agenda',
                                                                                            'reunião', 'criar',
                                                                                            'cria' 'nova']
        time_keywords = ['at'] if lang == 'en' else ['às']
        location_keywords = ['in'] if lang == 'en' else ['em', 'na', 'no', 'nos', 'num', 'numa', 'nuns', 'numas']
        title_keywords = ['titled', 'called', 'named'] if lang == 'en' else ['com o título', 'com o nome', 'chamada',
                                                                             'chamado', 'chamada', 'entitulada',
                                                                             'entitulado']
        description_keywords = ['about', 'regarding', 'concerning', 'description',
                                'description:'] if lang == 'en' else ['sobre', 'acerca', 'relativo', 'relativo a',
                                                                      'descrição', 'descrição:']
        command_words = command.split()
        intent_detected = any(keyword in command_words for keyword in keywords)

        doc = nlp(command)
        # doc = nlp("""The event is scheduled for 25th August 2023.
        #       We also have a meeting on 10 September and another one on the twelfth of October and a
        #       final one on January fourth.""")

        date_time = None
        for ent in doc.ents:
            if ent.label_ == "DATE":
                # print(f"Text: {ent.text} -> Parsed Date: {ent._.date}")
                date_time = ent._.date
                break

        if intent_detected:

            # if expression like"next friday", calculate the date
            if 'next' in command_words:
                next_index = command_words.index('next')
                next_day = command_words[next_index + 1].lower()
                #     use a library to calculate the date
                date_time = calculate_next_weekday(next_day)

            pt_kw = ['na próxima', 'no próximo']
            if any(keyword in command for keyword in pt_kw):
                if 'na próxima' in command:
                    next_index = command_words.index('próxima')
                else:
                    next_index = command_words.index('próximo')
                next_day = command_words[next_index + 1].lower()
                #     use a library to calculate the date
                date_time = calculate_next_weekday(next_day, lang='pt')

            # Extract time if time keywords are present
            """time = None
            if any(keyword in command_words for keyword in time_keywords):
                time_index = command_words.index('at')
                # if pm or am is prsent, the time is between 'at' and 'pm' or 'am'
                # if : is present, the time is between 'at' and the number after ':'
                time_end_index = None
                if 'pm' in command_words:
                    time_end_index = command_words.index('pm')
                elif 'am' in command_words:
                    time_end_index = command_words.index('am')
                elif ':' in command_words:
                    time_end_index = command_words.index(':')"""

            # set the time to the date_time
            if not date_time:
                # today plus a week
                today_day_name = dateparser.parse('today').strftime('%A').lower()
                date_time = calculate_next_weekday(today_day_name)

            # hardcode time as 15:00
            time = '15:00'
            if time:
                date_time = date_time.replace(hour=int(time.split(':')[0]), minute=int(time.split(':')[1]))

            # Extract location if 'in' keyword is present
            location = None
            if 'in' in command_words:
                location_index = command_words.index('in')
                # location = ' '.join(command_words[location_index + 1:])
                text_to_consider = command_words[location_index + 1:]
                text_to_consider = (' '.join(text_to_consider)).split(',')[0].strip()
                location = ''.join(text_to_consider)

            # location for portuguese
            location_keywords = ['em', 'na', 'no', 'nos', 'num', 'numa', 'nuns', 'numas']
            if any(keyword in command_words for keyword in location_keywords):
                location_kw = [kw for kw in location_keywords if kw in command_words]
                location_index = command_words.index(location_kw[0])
                # stop at full stop "."
                text_to_consider = command_words[location_index + 1:]
                text_to_consider = (' '.join(text_to_consider)).split(',')[0].strip()
                location = ''.join(text_to_consider)

            # Extract title if 'titled' keyword is present
            title = None
            if any(keyword in command_words for keyword in title_keywords):
                title_kw = [kw for kw in title_keywords if kw in command_words]
                title_index = command_words.index(title_kw[0])
                # stop at full stop "."
                text_to_consider = command.split(title_kw[0])[1].strip()
                text_to_consider = (''.join(text_to_consider)).split('.')[0].strip()
                title = ''.join(text_to_consider)
            description = ''

            for kw in description_keywords:
                if kw in command_words:
                    kw_index = command_words.index(kw)
                    description = ' '.join(command_words[kw_index + 1:]).strip("'")
                    break

            return {
                'intent': 'create_meeting',
                'date_time': date_time,
                'location': location,
                'title': title,
                'description': description
            }

        return {'intent': 'unknown'}

    user_id = request.user.id
    user = User.objects.get(id=user_id)
    data = request.data
    message = data['message']
    # send the message to the chatbot and get the response
    action = interpret_command(message)
    if action['intent'] == 'create_meeting':
        meeting = Meeting.objects.create(
            name=action['title'],
            date=action['date_time'],
            place=action['location'],
            description=action['description'],
        )
        meeting.participants.add(user)
        meeting.save()
        # response = f"Meeting {meeting.name} scheduled for {meeting.date.strftime('%d %B %Y %H:%M')}"
        # if meeting.place:
        #     response += f" at {meeting.place}"
        # if meeting.description:
        #     response += f" with description: {meeting.description}"
        # portuguese
        response = f"Reunião {meeting.name} agendada para {meeting.date.strftime('%d/%m/%Y às %H:%M')}"
        if meeting.place:
            response += f" em {meeting.place}"
        if meeting.description:
            response += f" com a descrição: {meeting.description}"


    else:
        response = "I'm sorry, I didn't understand your command. Please try again."
        # portuguese
        response = "Peço desculpa, não percebi o seu pedido. Por favor, tente novamente."
    return JsonResponse({'reply': response})


# Viewsets
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class MeetingViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()


class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()


class EmailViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = EmailSerializer
    queryset = Email.objects.all()


class PartnerCompanyViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = PartnerCompanySerializer
    queryset = PartnerCompany.objects.all()
