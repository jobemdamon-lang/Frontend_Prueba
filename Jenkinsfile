pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        SONARQUBE_SERVER = 'SonarQube'
        SCANNER_HOME = tool 'SonarScanner'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build script"'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh "${SCANNER_HOME}/bin/sonar-scanner" 
                }
            }
        }
    
        stage ('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

    post {
        success {
            echo 'Quality GATE PASSED'
        }
        failure {
            echo 'Quality Gate FAILED'
        }
    }

    
}
