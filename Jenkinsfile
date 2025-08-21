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
                    def buildCmd = ["docker", "build", "-t", "myapp:${env.BUILD_ID}", "."]
                    def process = buildCmd.execute()
                    process.in.eachLine { println it }
                    process.err.eachLine { println "ERREUR: $it" }
                    process.waitFor()
                }
            }
        }

        stage('Déployer en Test') {
            steps {
                script {
                    def runCmd = ["docker", "run", "-d", "-p", "3001:3000",
                                  "-e", "MESSAGE=Environnement de Test",
                                  "--name", "myapp-test",
                                  "myapp:${env.BUILD_ID}"]
                    def process = runCmd.execute()
                    process.in.eachLine { println it }
                    process.waitFor()
                }
            }
        }

        stage('Tests') {
            steps {
                script {
                    sleep 5
                    def curlCmd = ["curl", "http://localhost:3001"]
                    def process = curlCmd.execute()
                    process.in.eachLine { println it }
                    process.waitFor()
                }
            }
        }

        stage('Déployer en Production') {
            steps {
                script {
                    def userInput = input(message: "Voulez-vous déployer en production ?", ok: "Déployer")

                    def runCmd = ["docker", "run", "-d", "-p", "3000:3000",
                                  "-e", "MESSAGE=Environnement de Production",
                                  "--name", "myapp-prod",
                                  "myapp:${env.BUILD_ID}"]
                    def process = runCmd.execute()
                    process.in.eachLine { println it }
                    process.waitFor()
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    ["docker", "rm", "-f", "myapp-test"].execute().waitFor()
                } catch (Exception e) {
                    println "Pas de conteneur test à supprimer"
                }
            }
        }
    }
}
