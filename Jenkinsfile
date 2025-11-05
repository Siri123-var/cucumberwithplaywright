pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'  // Make sure this matches your Jenkins NodeJS installation name
    }
    
    environment {
        // Customize these if needed
        NODE_VERSION = '18.x'
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
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                // Install Playwright browsers
                sh 'npx playwright install chromium'
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    try {
                        // Create artifacts directories
                        sh 'mkdir -p test-results artifacts/screenshots artifacts/cucumber-report'
                        
                        // Run Cucumber tests
                        sh 'npm run test'
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
                    sh 'npm run report'
                    
                    // Publish Cucumber reports
                    cucumber buildStatus: 'UNSTABLE',
                            reportTitle: 'Cucumber Report',
                            fileIncludePattern: '**/cucumber-report.json',
                            jsonReportDirectory: 'test-results'
                            
                    // Archive artifacts
                    archiveArtifacts artifacts: 'artifacts/**/*', fingerprint: true
                }
            }
        }
    }
    
    post {
        always {
            // Clean up and publish test results
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