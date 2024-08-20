from django.core.management import BaseCommand
import dateparser
import spacy
from date_spacy import find_dates

# Load your desired spaCy model
nlp = spacy.blank('en')

# Add the component to the pipeline
nlp.add_pipe('find_dates')
# for times
# nlp.add_pipe('entity_ruler')

"""
name = models.CharField(max_length=255)
    date = models.DateTimeField()
    place = models.TextField()
    participants = models.ManyToManyField(User)
    # customers = models.ManyToManyField('Customer')
    description = models.TextField()
    
"""


def calculate_next_weekday(day: str, lang='en'):
    from datetime import datetime, timedelta
    day = day.lower()
    weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] if lang == 'en' else ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo']
    today = datetime.today()
    current_weekday = today.weekday()
    days_ahead = weekdays.index(day) - current_weekday
    if days_ahead <= 0:
        days_ahead += 7
    return today + timedelta(days=days_ahead)


def interpret_command(command, lang='pt'):
    keywords = ['schedule', 'meeting', 'create', 'new', 'titled'] if lang == 'en' else ['agendar', 'agenda', 'reunião', 'criar', 'cria' 'nova']
    time_keywords = ['at'] if lang == 'en' else ['às']
    location_keywords = ['in'] if lang == 'en' else ['em', 'na', 'no', 'nos', 'num', 'numa', 'nuns', 'numas']
    title_keywords = ['titled', 'called', 'named'] if lang == 'en' else ['com o título', 'com o nome', 'chamada', 'chamado', 'chamada', 'entitulada', 'entitulado']
    description_keywords = ['about', 'regarding', 'concerning', 'description', 'description:'] if lang == 'en' else ['sobre', 'acerca', 'relativo', 'relativo a', 'descrição', 'descrição:']
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


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        print('ijujujuj')
        # Test the function
        print(interpret_command("marca uma reunião para a próxima sexta-feira às 15h no meu escritório, chamada 'Reunião'. com a descrição 'Reunião importante'", lang='pt'))
        print(interpret_command("schedule a meeting at 3pm next Friday in my office", lang='en'))
        print(interpret_command("create a new meeting for 27th May 3pm in my office, titled 'Important discussions'. with the description ai ai ui", lang='en'))
