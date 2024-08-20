from django.urls import path, include
from rest_framework import routers

from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView,
)

from .views import CustomTokenObtainPairView


router = routers.DefaultRouter()

router.register(r'user', views.UserViewSet)
router.register(r'customer', views.CustomerViewSet)
router.register(r'meeting', views.MeetingViewSet)


# The presence or absence of the trailing slash in the path() must match the URL pattern in the request.


urlpatterns = [
    path(r'api/auth/test', views.test_auth),
    # path('api/auth/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # unused

    path('api/meetings', views.get_meetings),
    path('api/meetings/create', views.create_meeting),
    path('api/meetings/edit', views.edit_meeting),

    path('api/projects/', views.project_list, name='project-list'),
    path('api/projects/<int:projectId>', views.get_project, name='project-page'),
    path('api/projects/<int:projectId>/users', views.get_project_users, name='project-users'),
    path('api/projects/edit', views.edit_project, name='edit-project'),
    path('api/projects/edit/users', views.edit_project_assignees, name='edit-project-assignees'),
    path('api/projects/edit/tasks', views.edit_project_tasks, name='edit-project-tasks'),
    path('api/projects/create', views.create_project, name='create-project'),


    path('api/other-users', views.get_other_users),
    path('api/tasks', views.get_tasks, name='get-tasks'),
    path('api/tasks/create', views.create_task, name='create_task'),
    path('api/tasks/<str:status>', views.get_tasks, name='get-tasks-by-status'),
    path('api/tasks/update/<int:task_id>', views.update_task, name='update_task'),
    path('api/tasks/delete/<int:task_id>', views.delete_task, name='delete_task'),

    # search with q and filters and sort parameters
    path('api/search', views.search),

    path("api_search/", include(router.urls)),

    path('api/chat', views.reply_chatbot_message),

]

