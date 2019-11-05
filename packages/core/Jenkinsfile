pipeline {
  agent {label 'centcom-docker'}

  environment {
      NODE_ENV = 'cert'
  }

  stages {
    stage('Install') {
      steps {
        nodejs('main') {
          sh 'npm ci'
        }
      }
    }
    stage('Deploy Containers') {
      steps {
        nodejs('main') {
          sh 'npm run deploy'
        }
      }
    }
    stage('Prep Database') {
      steps {
        nodejs('main') {
          sh 'npm run db:up'
        }
      }
    }
  }
}