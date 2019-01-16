namespace :db do
  task :dump do
    path_folder = File.join(Dir.home, "backUP")
    name_backup = Time.now.strftime("%Y%m%d%H%M%S")
    Dir.mkdir(path_folder) unless File.exists?(path_folder)
    number_file = Dir["#{path_folder}/**/*"].length
    dumpfile = "#{ path_folder }/#{ name_backup }.sql"
    production = Rails.application.config.database_configuration['production']
    if number_file == 3
      oldest_file = Dir["#{ path_folder }/*.sql"].sort_by{ |f| File.mtime(f) }.first
      File.delete(oldest_file)
    end
    system "'PGPASSWORD=\"#{ production['password'] }\" pg_dump #{ production['database'] }' > #{ dumpfile }"
  end
end