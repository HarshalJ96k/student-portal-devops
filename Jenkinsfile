
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
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    bat '''
                        @echo off
                        echo Logging in to Docker Hub...
                        echo %DOCKERHUB_TOKEN% | "%DOCKER_EXE%" login --username "%DOCKERHUB_USERNAME%" --password-stdin
                        if errorlevel 1 exit /b 1
                    '''
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
