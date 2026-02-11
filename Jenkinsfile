pipeline {
    agent any

    tools {
        nodejs 'Node20'
        sonarQubeScanner 'SonarScanner'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/TU_REPO.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }
    }
}
