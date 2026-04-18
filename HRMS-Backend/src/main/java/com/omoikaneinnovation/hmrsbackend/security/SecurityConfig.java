package com.omoikaneinnovation.hmrsbackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.Customizer;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // ✅ REQUIRED
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

   @Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration config = new CorsConfiguration();

    config.setAllowCredentials(true);

    // Allow both localhost (development) and production URLs
   config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5176",
    "https://hrmsbackendfullrenderingapplication.vercel.app",
    "https://hrmsbackendfrontendapp.vercel.app"
));

   

    config.setAllowedHeaders(List.of("*"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setExposedHeaders(List.of("Authorization"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
}

    /* ================= ROLE HIERARCHY ================= */
    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();
       hierarchy.setHierarchy(
    "ROLE_ADMIN > ROLE_HR \n ROLE_HR > ROLE_EMPLOYEE"
);
        return hierarchy;
    }

    /* ================= APPLY ROLE HIERARCHY ================= */
    @Bean
    public MethodSecurityExpressionHandler methodSecurityExpressionHandler(
            RoleHierarchy roleHierarchy) {

        DefaultMethodSecurityExpressionHandler handler = new DefaultMethodSecurityExpressionHandler();
        handler.setRoleHierarchy(roleHierarchy);
        return handler;
    }

    /* ================= SECURITY FILTER ================= */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
           .authorizeHttpRequests(auth -> auth
                // ✅ ALLOW PREFLIGHT (THIS IS KEY FIX)
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
    // PUBLIC APIs
     .requestMatchers("/error").permitAll()
    
    .requestMatchers("/api/onboarding/**").permitAll()
    .requestMatchers("/test/**").permitAll()
    .requestMatchers("/api/otp/**").permitAll()
    .requestMatchers("/api/auth/**").permitAll()

      // ✅ ADD THIS LINE
    .requestMatchers("/api/home/**").authenticated()
    
    .requestMatchers("/api/attendance/**").permitAll()
    .requestMatchers("/api/leave/**").permitAll()
    .requestMatchers("/api/timesheet/**").permitAll()
    .requestMatchers("/api/admin/register", "/api/admin/login", "/api/admin/send-link/**").permitAll()
     
    // ROLE BASED APIs
      .requestMatchers("/api/employee/create").permitAll() // ✅ ADD THIS
      .requestMatchers("/api/employee/all").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/hr/**").hasRole("HR")
    .requestMatchers("/api/employee/**").hasAnyRole("ADMIN","HR","EMPLOYEE")
    
// ✅ ADD HERE
.requestMatchers("/api/performance/**").hasAnyRole("ADMIN","HR","EMPLOYEE")
    .requestMatchers("/api/resignation/**").hasAnyRole("EMPLOYEE","HR","ADMIN")
.requestMatchers("/api/increment/**").hasAnyRole("HR","ADMIN","EMPLOYEE")

    // REPORTS API (HR ANALYTICS DASHBOARD)
//.requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "HR")
    
    .requestMatchers("/api/reimbursements/**").permitAll()
.requestMatchers("/api/insurance/**").permitAll()

.requestMatchers("/api/payroll/**").permitAll()
.requestMatchers("/api/recruitment/**").permitAll()
.requestMatchers("/api/financial/**").permitAll()
.requestMatchers("/api/jobs/**").permitAll() 
.requestMatchers("/api/tasks/**").permitAll()
.requestMatchers("/api/company").permitAll()
.requestMatchers("/api/designations/**").permitAll()
.requestMatchers("/api/departments/**").permitAll()



  // ✅ ADD THIS
  .requestMatchers("/api/chat/users").permitAll()

    // WEBSOCKET
    .requestMatchers("/ws/**","/ws/info","/info","/app/**","/topic/**","/user/**").permitAll()

    // OPTIONS
    .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()

    .anyRequest().authenticated()
)
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);





        return http.build();
    }

} // <-- Closing brace