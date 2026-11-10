
pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

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
                bat '''
                    "%DOCKER_EXE%" build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .
                '''
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
                    powershell '''
                        $ErrorActionPreference = "Stop"

                        if ([string]::IsNullOrWhiteSpace($env:DOCKERHUB_TOKEN)) {
                            throw "Docker Hub token is missing."
                        }

                        $startInfo = New-Object System.Diagnostics.ProcessStartInfo
                        $startInfo.FileName = $env:DOCKER_EXE
                        $startInfo.Arguments = "login --username `"$($env:DOCKERHUB_USERNAME)`" --password-stdin"
                        $startInfo.UseShellExecute = $false
                        $startInfo.CreateNoWindow = $true
                        $startInfo.RedirectStandardInput = $true
                        $startInfo.RedirectStandardOutput = $true
                        $startInfo.RedirectStandardError = $true

                        $process = New-Object System.Diagnostics.Process
                        $process.StartInfo = $startInfo

                        [void]$process.Start()

                        $stdoutTask = $process.StandardOutput.ReadToEndAsync()
                        $stderrTask = $process.StandardError.ReadToEndAsync()

                        $process.StandardInput.WriteLine($env:DOCKERHUB_TOKEN)
                        $process.StandardInput.Close()

                        $process.WaitForExit()

                        $stdout = $stdoutTask.GetAwaiter().GetResult()
                        $stderr = $stderrTask.GetAwaiter().GetResult()

                        if ($stdout) {
                            Write-Output $stdout.Trim()
                        }

                        if ($process.ExitCode -ne 0) {
                            if ($stderr) {
                                Write-Output $stderr.Trim()
                            }
                            exit $process.ExitCode
                        }

                        $process.Dispose()
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat '''
                    "%DOCKER_EXE%" push %IMAGE_NAME%:%BUILD_NUMBER%
                '''

                bat '''
                    "%DOCKER_EXE%" push %IMAGE_NAME%:latest
                '''
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

        always {
            echo 'Student Portal CI/CD Pipeline execution finished.'
        }
    }
}
