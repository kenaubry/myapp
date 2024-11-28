pipeline {
    agent any

    stages {
        stage('Cloner le Code') {
            steps {
                git branch: 'main', url: 'https://github.com/kenaubry/myapp.git'
            }
        }

        stage('Construire l\'Image Docker') {
            steps {
                script {
                    dockerImage = docker.build("myapp:${env.BUILD_ID}")
                }
            }
        }

        stage('Déployer en Test') {
            steps {
                script {
                    bat 'docker rm -f myapp-test || exit 0'
                    bat "docker run -d -p 3001:3000 -e MESSAGE='Environnement de Test' --name myapp-test ${dockerImage.id}"
                }
            }
        }

        stage('Tests') {
            steps {
                bat 'timeout /t 5' // Equivalent de 'sleep' sur Windows
                bat 'curl http://localhost:3001'
            }
        }

        stage('Déployer en Production') {
            steps {
                script {
                    def userInput = input(
                        message: "Voulez-vous déployer en production ?",
                        ok: "Déployer"
                    )
                    bat 'docker rm -f myapp-prod || exit 0'
                    bat "docker run -d -p 3000:3000 -e MESSAGE='Environnement de Production' --name myapp-prod ${dockerImage.id}"
                }
            }
        }
    }

    post {
        always {
            script {
                bat 'docker rm -f myapp-test || exit 0'
            }
        }
    }
}
