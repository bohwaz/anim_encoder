#!/usr/bin/ruby

# Requires xrectsel, imagemagick, and avconv or ffmpeg.

def run(cmd)
  puts cmd
  system(cmd)
end

if ARGV.length == 0
  puts "Usage: ./record.rb <animation_name>"
  exit
end

name = ARGV[0]
x, y, w, h = `xrectsel '%x %y %w %h'`.strip.split(' ')
run("avconv -video_size #{w}x#{h} -framerate 15 -f x11grab -i :0.0+#{x},#{y} -crf 0 -preset ultrafast #{name}_%05d.png")
run("mogrify -background white -alpha remove -strip -define png:format=png24 #{name}*.png")
