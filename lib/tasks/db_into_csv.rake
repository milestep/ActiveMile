task :db_into_csv => :environment do
  FileUtils.mkdir_p('db/csv')
  FileUtils.rm_f Dir.glob("#{Rails.root}/db/csv/*")
  ActiveRecord::Base.establish_connection
  skip_tables = ["schema_info", "schema_migrations", "ar_internal_metadata", "oauth_access_grants", "oauth_applications", "oauth_access_tokens"]

  (ActiveRecord::Base.connection.tables - skip_tables).each do |table_name|
    CSV.open("#{Rails.root}/db/csv/#{table_name}.csv", "wb") do |csv|
      model = table_name.classify.constantize
      csv << model.column_names
      model.all.each do |object|
        csv << model.column_names.map {|c| object.attributes[c]}
      end
    end
  end
end