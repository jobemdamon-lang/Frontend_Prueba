pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build script"'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        ${tool 'SonarScanner'}/bin/sonar-scanner
                    """
                }
            }
        }
    }
}
