import os
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Load all fixtures from a folder'

    def add_arguments(self, parser):
        parser.add_argument('folder', nargs='+', type=str)

    def handle(self, *args, **options):
        folder_path = options['folder'][0]
        files = [f for f in os.listdir(folder_path) if f.endswith('.json')]
        for file_name in files:
            file_path = os.path.join(folder_path, file_name)
            call_command('loaddata', file_path)
