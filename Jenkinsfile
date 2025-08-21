pipeline {
    agent {
        docker {
            image 'docker:24.0.7-cli'    // Image officielle Docker CLI
            args '-v /var/run/docker.sock:/var/run/docker.sock'  // Monter le socket Docker pour pouvoir lancer des containers
        }
    }

    stages {
        stage('Cloner le Code') {
            steps {
                git branch: 'main', url: 'https://github.com/kenaubry/myapp.git'
            }
        }

        stage('Construire l\'Image Docker') {
            steps {
                script {
                    sh "docker build -t myapp:${env.BUILD_ID} ."
                }
            }
        }

        stage('Déployer en Test') {
            steps {
                sh "docker run -d -p 3001:3000 -e MESSAGE='Environnement de Test' --name myapp-test myapp:${env.BUILD_ID}"
            }
        }

        stage('Tests') {
            steps {
                sh "sleep 5"
                sh "curl http://localhost:3001"
            }
        }

        stage('Déployer en Production') {
            steps {
                script {
                    def userInput = input(
                        message: "Voulez-vous déployer en production ?",
                        ok: "Déployer"
                    )
                    sh "docker run -d -p 3000:3000 -e MESSAGE='Environnement de Production' --name myapp-prod myapp:${env.BUILD_ID}"
                }
            }
        }
    }

    post {
        always {
            sh "docker rm -f myapp-test || true"
        }
    }
}
