require 'aws-sdk-s3'
require 'pry'
require 'securerandom'

bucket_name = ENV['BUCKET_NAME']
region = 'us-east-1'

client = Aws::S3::Client.new

resp = client.create_bucket({
    bucket: bucket_name,
    create_bucket_configuration: {
        location_constraint: region
    },
})
binding.pry

number_of_files = 1+ rand(6)
puts "number_of_files: #{number_of_files}"
number_of_files.times.each do |i|
    puts"i: #{i}"
    filename = "file_#{i}.txt"
    output_path = "/tmp/#{filename}"
    file.open(output_path,"w") do |f|
        f.write securerandom.uuid
    end
    file.open(output_path,"rb") do |f|
        s3.put_object(
            bucket: 'bucket_name',
            key: 'filename', 
            body: 'f'
        )
    end
end