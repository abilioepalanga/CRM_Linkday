# make this request
"""
fetch("https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats%2F19%3A48d31887-5fad-4d73-a9f5-3c356e68a038_f791c3e7-407e-49b9-bccd-f555774bf6b0%40unq.gbl.spaces%2Fmessages", {
  "headers": {
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
  },
  "referrer": "https://developer.microsoft.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
"""
import joblib
# and then print the response
import requests
import json


def main():
    # url1 = "https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats%2F19%3A48d31887-5fad-4d73-a9f5-3c356e68a038_f791c3e7-407e-49b9-bccd-f555774bf6b0%40unq.gbl.spaces%2Fmessages"
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

    url2 = "https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats"
    # make a request here and list the chat ids
    response = requests.get(url2, headers=headers)

    ids = []
    for chat in response.json()['value']:
        ids.append(chat['id'])
    # print(ids)

    responses = []
    # for every chat list the messages ordered by date. show also, if applicable the topic of the chat
    for chat_id in ids[:5]:
        url = f"https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats%2F{chat_id}%2Fmessages"
        response = requests.get(url, headers=headers)
        print(json.dumps(response.json(), indent=4))
        # print("-----------------------\n")
        responses.append(response.json())

    # create an html file to display the messages
    html = "<html><body>"

    """message example
          {
                "id": "1698974389784",
                "replyToId": null,
                "messageType": "message" ####ignore if it is other than message,
                "createdDateTime": "2023-11-03T01:19:49.784Z",
                "lastModifiedDateTime": "2023-11-25T10:04:32.402Z",
                "lastEditedDateTime": null,
                "deletedDateTime": "2023-11-25T10:04:32.402Z", ignore if not null
                "subject": null,
                "summary": null,
                "chatId": "19:2894b8353ac24fbbbc13391aab6fc952@thread.v2",
                "importance": "normal",
                "from": {
                    "user": {
                        "@odata.type": "#microsoft.graph.teamworkUserIdentity",
                        "id": "f791c3e7-407e-49b9-bccd-f555774bf6b0",
                        "displayName": "Jiayang Liu",
                        "userIdentityType": "aadUser",
                        "tenantId": "6a425d0d-58f2-4e36-8689-10002b2ec567"
                    }
                },
                "body": {
                    "contentType": "html",
                    "content": ""
                },
                "attachments": [],
                "mentions": [],
            },
    """

    for response in responses[:]:
        for message in response['value']:
            if message['messageType'] != 'message':
                continue

            if message['subject']:
                print(f"Chat topic: {message['subject']}")
                html += f"<p>Chat topic: {message['subject']}</p><br>"
            if message['from']:
                print(f"From: {message['from']['user']['displayName']}")
                html += f"<p>From: {message['from']['user']['displayName']}</p><br>"

            if message['createdDateTime']:
                print(f"Date: {message['createdDateTime']}")
                html += f"<p>Date: {message['createdDateTime']}</p><br>"

            print(message['body']['content'])

            # replace the <at> tags with <a> tags, they are "<at id="number">Name</at>
            content = message['body']['content']
            content = content.replace("<at", "<a href=''")
            content = content.replace("</at>", "</a>")

            html += f"Message:\n {content}<br>"

        print("---------------------------------------------------\n")
        html += "<br>---------------------------------------------------<br>"

    html += "</body></html>"
    with open("messages.html", "w", encoding='utf-8') as f:
        f.write(html)


def gen_dict_extract(keys, var):
    for key in keys:
        if hasattr(var, 'items'):
            for k, v in var.items():
                if k == key:
                    yield {k: v}
                if isinstance(v, dict):
                    for result in gen_dict_extract([key], v):
                        yield result
                elif isinstance(v, list):
                    for d in v:
                        for result in gen_dict_extract([key], d):
                            yield result


def search_messages(messages, query):
    matching_messages = []
    query = query.lower()
    for message in messages:
        # message = message['value']
        if message.get('from') and query in message['from']['user']['displayName'].lower():
            matching_messages.append(message)
        elif message.get('body') and query in message['body']['content'].lower():
            matching_messages.append(message)
        elif message.get('summary') and query in message['summary'].lower():
            matching_messages.append(message)
        elif message.get('subject') and query in message['subject'].lower():
            matching_messages.append(message)
    return matching_messages


if __name__ == "__main__":
    # main()
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

    url2 = "https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats"
    # make a request here and list the chat ids

    # response = requests.get(url2, headers=headers)
    # # print(response.text)
    #
    # ids = []
    # for chat in response.json()['value']:
    #     ids.append(chat['id'])
    #
    # responses = []
    # # for every chat list the messages ordered by date. show also, if applicable the topic of the chat
    # for chat_id in ids[:5]:
    #     url = f"https://graph.office.net/en-us/graph/api/proxy?url=https%3A%2F%2Fgraph.microsoft.com%2Fbeta%2Fme%2Fchats%2F{chat_id}%2Fmessages"
    #     response = requests.get(url, headers=headers)
    #     responses.append(response.json())
    #
    # joblib.dump(responses, "responses.pkl")

    responses = joblib.load("responses.pkl")

    query = "Liu"
    key_paths = ["value.from.user.displayName", "value.body.content", "value.summary", "value.subject"]
    # key_paths = [path.split(".") for path in key_paths]
    # matching_messages = search_dict_paths(responses, key_paths, query)


    # use gen_dict_extract to search for the query in the keys
    res = []
    # for response in responses:
    #     for x in gen_dict_extract(['displayName', 'content', 'summary', 'subject'], response):
    #         res.append(x)
    # print(res)

    message_values = [message for response in responses for message in response['value']]
    matching_messages = search_messages(message_values, 'hello')
    # filter_message_fields(matching_messages, ['id', 'rpelyToId', 'createdDateTime',
    #                                           'lastModifiedDateTime', 'lastEditedDateTime', 'deletedDateTime',
    #                                           'subject', 'summary', 'chatId', 'importance', 'from','attachments',
    #                                           'from', 'body', 'mentions'])
    print(matching_messages)
