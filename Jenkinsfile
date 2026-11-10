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
