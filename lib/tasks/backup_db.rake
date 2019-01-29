require './services/task/backup'

namespace :db do
  task :dump => :environment do
    BackUp.new.perform!
  end
end