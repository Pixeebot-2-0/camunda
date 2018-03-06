def githubOrga = 'camunda'
def gitRepository = 'camunda-optimize'
def gitBranch = 'master'

pipelineJob('Performance Large Dataset') {
  definition {
    cps {
      script(readFileFromWorkspace('.ci/pipelines/performance_large.groovy'))
      sandbox()
    }
  }

  jdk '(Default)'

  triggers {
    cron('0 3 * * *')
  }

  publishers {
    extendedEmail {
      triggers {
        statusChanged {
          sendTo {
            culprits()
            requester()
          }
        }
      }
    }
  }
}