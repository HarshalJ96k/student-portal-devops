
pipeline {
    agent any

    tools {
        nodejs 'Node22'
    }

    environment {
        IMAGE_NAME = 'harshal96k/student-portal'
        DOCKER_EXE = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER_EXE%" build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
            }
        }

       
stage('Docker Hub Login') {
    steps {
        script {
            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )
            ]) {
                def docker = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe'

                def process = [
                    docker,
                    'login',
                    '--username',
                    env.DOCKERHUB_USERNAME,
                    '--password-stdin'
                ].execute()

                process.outputStream.withWriter('UTF-8') {
                    it.write(env.DOCKERHUB_TOKEN)
                }
                process.outputStream.close()

                def output = process.inputStream.text
                def errors = process.errorStream.text
                def exitCode = process.waitFor()

                echo output
                if (exitCode != 0) {
                    echo errors
                    error('Docker Hub authentication failed')
                }
            }
        }
    }
}


        stage('Push to Docker Hub') {
            steps {
                bat '"%DOCKER_EXE%" push %IMAGE_NAME%:%BUILD_NUMBER%'
                bat '"%DOCKER_EXE%" push %IMAGE_NAME%:latest'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Student Portal CI/CD Pipeline completed!'
        }
        failure {
            echo 'FAILED: Check the Jenkins Console Output.'
        }
    }
}
