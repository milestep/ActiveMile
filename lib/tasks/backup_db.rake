namespace :db do
  task :dump do
    pathFolder = "#{Rails.root}"
    count = Dir.glob(File.join(pathFolder, '**', '*')).select { |file| File.file?(file) }.count
    dumpfile = "#{pathFolder}/#{Time.now.strftime("%Y%m%d%H%M%S")}.sql"
    production = Rails.application.config.database_configuration['production']
    if count == 3
      File.delete(Dir.glob("#{pathFolder}/*.sql").sort_by{|f| File.mtime(f)}.first)
      system "'PGPASSWORD=\"#{production['password']}\" pg_dump #{production['database']}' > #{dumpfile}"
    else
      system "'PGPASSWORD=\"#{production['password']}\" pg_dump #{production['database']}' > #{dumpfile}"
    end
  end
end