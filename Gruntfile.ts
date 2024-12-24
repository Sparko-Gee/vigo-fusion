// Load the Grunt module  
module.exports = function(grunt) {  
  
  // Project configuration  
  grunt.initConfig({  
    pkg: grunt.file.readJSON('package.json'), // Read package.json for project metadata  

    // Example task configuration  
    uglify: {  
      options: {  
        mangle: false // Do not mangle variable names  
      },  
      my_target: {  
        files: {  
          'dest/output.min.js': ['src/input.js'] // Minify input.js to output.min.js  
        }  
      }  
    },  

    // Other task configurations can go here  
  });  

  // Load the plugins for the tasks  
  grunt.loadNpmTasks('grunt-contrib-uglify'); // Load the Uglify plugin  

  // Register a default task that runs when you type 'grunt' in the command line  
  grunt.registerTask('default', ['uglify']); // Run the uglify task by default  
};