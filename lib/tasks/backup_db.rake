require './services/task/backup'

namespace :db do
  task :dump => :environment do
    BackupDb.new
  end
end