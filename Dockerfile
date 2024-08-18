FROM ubuntu:latest
LABEL authors="TRI"

ENTRYPOINT ["top", "-b"]
