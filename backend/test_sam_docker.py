import sys
sys.path.append("/opt/homebrew/Cellar/aws-sam-cli/1.142.1/libexec/lib/python3.13/site-packages")
import docker
import os

print(f"DOCKER_API_VERSION env: {os.environ.get('DOCKER_API_VERSION')}")

try:
    client = docker.from_env()
    print(f"Client API version: {client.api.api_version}")
    print(client.version())
    print("Success!")
except Exception as e:
    print(f"Error: {e}")
