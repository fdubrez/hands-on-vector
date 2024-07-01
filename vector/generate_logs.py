import random
import time
from datetime import datetime
import argparse
import socket

# Parse command-line arguments
parser = argparse.ArgumentParser(description='Generate logs in syslog format')
parser.add_argument('--interval', type=int, help='Interval in seconds between log entries (default is 2)')
parser.add_argument('--format', choices=['syslog', 'apache'])
args = parser.parse_args()

if args.interval is None:
    interval = 2  # default interval if not specified
else:
    interval = args.interval

hostname = socket.gethostname()

while True:
    # Create a timestamp and message
    if args.format == 'syslog':
        timestamp = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
        message = f"""<13>1 {timestamp}.000Z deathstar.01 sensors 2426 ID931 [exampleSDID@32473 type="proximity"] proximity sensor alert..."""

    if (args.format == 'apache'):
        # List of possible IP addresses
        ips = ['226.219.134.115', '192.168.1.54', '10.0.0.1']
        # List of possible user agents
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.35',
            'Mozilla/5.0 (Linux; Android 8.1.0; Pixel 2 XL Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.90 Mobile Safari/537.36',
        ]

        # # Generate a random IP address
        # ip = random.choice(ips)
        # Generate a random user agent
        user_agent = random.choice(user_agents)
        # Generate a random date and time
        now = datetime.now()
        timestamp = now.strftime('[%d/%b/%Y:%H:%M:%S +0000]')
        # Generate the request line
        request_line = 'POST /death/star/auth HTTP/2.0'

        # Randomly select a status code (200 or 401) and calculate the response length accordingly
        if random.randint(0, 1):
            ip = f"192.168.1.{random.randint(50, 52)}"
            status_code = '200'
            response_length = str(random.randint(10000, 20000))
        else:
            ip = f"226.219.134.{random.randint(110, 115)}"
            status_code = '403'
            response_length = '0'

        # Combine all the components into a log line
        message = f"""{ip} - - {timestamp} "{request_line}" {status_code} {response_length}"""

    print(message)
    # Sleep for the specified interval before the next iteration
    time.sleep(interval)