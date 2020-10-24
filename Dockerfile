FROM ubuntu:20.04

RUN echo Updating existing packages..
RUN apt-get update

# Add the PostgreSQL PGP key to verify their Debian packages.
# It should be the same key as https://www.postgresql.org/media/keys/ACCC4CF8.asc

# RUN apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8

# Add PostgreSQL's repository. It contains the most recent stable release of PostgreSQL.

# RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Install PostgreSQL 9.3
#  There are some warnings (in red) that show up during the build. You can hide
#  them by prefixing each apt-get statement with DEBIAN_FRONTEND=noninteractive

# RUN apt -y upgrade \
#     && apt install -y gnupg2 \
#     && apt install -y python3 \
#     && apt install -y python3-pip \
#     && apt install -y poppler-utils \
#     && apt install -y libsm6 libxext6 libxrender-dev

# ARG DEBIAN_FRONTEND=noninteractive
# RUN apt-get install --yes postgresql postgresql-client postgresql-contrib

# Note: The official Debian and Ubuntu images automatically ``apt-get clean``
# after each ``apt-get``

# Run the rest of the commands as the ``postgres`` user created by the ``postgres`` package when it was ``apt-get installed``
# USER postgres
# ARG DB_USER=docker
# ARG DB_NAME=fastify
# ARG DB_PASSWORD=dockerFastify
# ENV DB_USER=${DB_USER}
# ENV DB_PASSWORD=${DB_PASSWORD}
# ENV DB_NAME=${DB_NAME}

# Set env variables used by server
# ENV DB_CLIENT=pg
# ENV DB_HOST=localhost
# ENV DB_PORT=5432

# RUN /etc/init.d/postgresql start &&\
#     psql --command "CREATE USER ${DB_USER} WITH SUPERUSER PASSWORD '${DB_PASSWORD}';" &&\
#     createdb -O ${DB_NAME} ${DB_USER}

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
# RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.3/main/pg_hba.conf

# And add ``listen_addresses`` to ``/etc/postgresql/9.3/main/postgresql.conf``
# RUN echo "listen_addresses='*'" >> /etc/postgresql/9.3/main/postgresql.conf

# Expose the PostgreSQL port
# EXPOSE ${DB_PORT}

# Add VOLUMEs to allow backup of config, logs and databases
# VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

# Install Node.js
RUN echo Installing Node.js v12
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

RUN mkdir app && cd app
WORKDIR /app
COPY . .
RUN npm install
# EXPOSE 8088
CMD ["npm", "start"]

# Set the default command to run when starting the container
# Here start the Postgres and server
# CMD ["/usr/lib/postgresql/9.3/bin/postgres", "-D", "/var/lib/postgresql/9.3/main", "-c", "config_file=/etc/postgresql/9.3/main/postgresql.conf", "npm", "start"]
