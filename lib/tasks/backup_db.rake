namespace :db do
  task :dump do
    path_folder = "#{ Rails.root }"
    number_file = Dir.glob(File.join(path_folder,'**', '*')).select { |file| File.file?(file) }.count
    dumpfile = "#{ path_folder }/#{ Time.now.strftime("%Y%m%d%H%M%S") }.sql"
    production = Rails.application.config.database_configuration['production']
    if number_file == 3
      File.delete(Dir.glob("#{ path_folder }/*.sql").sort_by{ |f| File.mtime(f) }.first)
      system "'PGPASSWORD=\"#{ production['password'] }\" pg_dump #{ production['database'] }' > #{ dumpfile }"
    else
      system "'PGPASSWORD=\"#{ production['password'] }\" pg_dump #{ production['database'] }' > #{ dumpfile }"
    end
  end
end