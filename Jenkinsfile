pipeline {
    agent any
    
    environment {
        // Customize these if needed
        SCREENSHOT_DIR = 'artifacts/screenshots'
        REPORT_DIR = 'artifacts/cucumber-report'
    }
    
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // For Windows
                    bat 'npm config ls'
                    bat 'npm install'
                    // Install Playwright browsers
                    bat 'npx playwright install chromium'
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    try {
                        // Create artifacts directories (using Windows commands)
                        bat 'if not exist test-results mkdir test-results'
                        bat 'if not exist artifacts\\screenshots mkdir artifacts\\screenshots'
                        bat 'if not exist artifacts\\cucumber-report mkdir artifacts\\cucumber-report'
                        
                        // Run Cucumber tests
                        bat 'npm run test'
                    } catch (err) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Tests failed but continuing to generate reports..."
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                script {
                    // Generate Cucumber HTML report
                    bat 'npm run report'
                    
                    // Publish Cucumber reports
                    cucumber buildStatus: 'UNSTABLE',
                            reportTitle: 'Cucumber Report',
                            fileIncludePattern: '**/cucumber-report.json',
                            jsonReportDirectory: 'test-results'
                }
            }
        }
    }
    
    
    post {
        always {
            // Archive artifacts
            // archiveArtifacts artifacts: 'artifacts/**/*', fingerprint: true
            
            // Publish HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'artifacts/cucumber-report',
                reportFiles: 'index.html',
                reportName: 'Cucumber HTML Report',
                reportTitles: 'Cucumber Report'
            ])
        }
        
        failure {
            echo 'Pipeline failed!'
        }
        
        unstable {
            echo 'Pipeline is unstable (some tests failed)'
        }
        
        success {
            echo 'Pipeline succeeded!'
        }
    }
}