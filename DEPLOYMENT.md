# 🚀 SmartTatkal Deployment Guide

This guide covers deploying SmartTatkal to various platforms with production-ready configurations.

## 📋 Pre-deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] TypeScript compilation successful (`npm run type-check`)
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] Rate limiting configured
- [ ] Logging setup complete
- [ ] Docker images built and tested

## 🌐 Platform-Specific Deployments

### Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel)
1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Configure Vercel**
   - Import project from GitHub
   - Set build command: `npm run build`
   - Set output directory: `.next`
   - Set root directory: `my-app`

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NODE_ENV=production
   ```

#### Backend (Railway)
1. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Configure Railway**
   - Set start command: `npm start`
   - Set root directory: `my-app/server`
   - Configure environment variables

3. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   LOG_LEVEL=info
   ```

### Docker + Cloud Platforms

#### AWS ECS/Fargate
1. **Build and Push Images**
   ```bash
   # Build images
   docker build -t smarttatkal-frontend ./my-app
   docker build -t smarttatkal-backend ./my-app/server
   
   # Tag for ECR
   docker tag smarttatkal-frontend:latest 123456789.dkr.ecr.region.amazonaws.com/smarttatkal-frontend:latest
   docker tag smarttatkal-backend:latest 123456789.dkr.ecr.region.amazonaws.com/smarttatkal-backend:latest
   
   # Push to ECR
   aws ecr get-login-password --region region | docker login --username AWS --password-stdin 123456789.dkr.ecr.region.amazonaws.com
   docker push 123456789.dkr.ecr.region.amazonaws.com/smarttatkal-frontend:latest
   docker push 123456789.dkr.ecr.region.amazonaws.com/smarttatkal-backend:latest
   ```

2. **ECS Task Definition**
   ```json
   {
     "family": "smarttatkal",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "123456789.dkr.ecr.region.amazonaws.com/smarttatkal-backend:latest",
         "portMappings": [{"containerPort": 5000}],
         "environment": [
           {"name": "NODE_ENV", "value": "production"},
           {"name": "PORT", "value": "5000"}
         ]
       },
       {
         "name": "frontend", 
         "image": "123456789.dkr.ecr.region.amazonaws.com/smarttatkal-frontend:latest",
         "portMappings": [{"containerPort": 3000}],
         "environment": [
           {"name": "NODE_ENV", "value": "production"},
           {"name": "NEXT_PUBLIC_API_URL", "value": "https://api.smarttatkal.com"}
         ]
       }
     ]
   }
   ```

#### Google Cloud Run
1. **Deploy Backend**
   ```bash
   cd my-app/server
   gcloud run deploy smarttatkal-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,PORT=8080
   ```

2. **Deploy Frontend**
   ```bash
   cd my-app
   gcloud run deploy smarttatkal-frontend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,NEXT_PUBLIC_API_URL=https://smarttatkal-backend-xxx.run.app
   ```

### Kubernetes Deployment

#### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smarttatkal-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: smarttatkal-backend
  template:
    metadata:
      labels:
        app: smarttatkal-backend
    spec:
      containers:
      - name: backend
        image: smarttatkal-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "5000"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: smarttatkal-backend-service
spec:
  selector:
    app: smarttatkal-backend
  ports:
  - port: 80
    targetPort: 5000
  type: ClusterIP
```

#### Frontend Deployment
```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smarttatkal-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: smarttatkal-frontend
  template:
    metadata:
      labels:
        app: smarttatkal-frontend
    spec:
      containers:
      - name: frontend
        image: smarttatkal-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_API_URL
          value: "http://smarttatkal-backend-service"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: smarttatkal-frontend-service
spec:
  selector:
    app: smarttatkal-frontend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 🔧 Production Configuration

### Environment Variables

#### Frontend (.env.production)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.smarttatkal.com
NEXT_TELEMETRY_DISABLED=1
```

#### Backend (.env.production)
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://smarttatkal.com
LOG_LEVEL=info
JWT_SECRET=your-super-secure-jwt-secret
```

### Nginx Configuration (Optional)
```nginx
# /etc/nginx/sites-available/smarttatkal
server {
    listen 80;
    server_name smarttatkal.com www.smarttatkal.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smarttatkal.com www.smarttatkal.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Logging

### Health Checks
- Frontend: `GET /api/health`
- Backend: `GET /health`

### Logging
- Structured JSON logs via Winston
- Log levels: error, warn, info, debug
- Log rotation and retention policies

### Metrics (Optional)
```javascript
// Add to backend for basic metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});
```

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured (Helmet.js)
- [ ] Rate limiting implemented
- [ ] Input validation with Zod
- [ ] Environment variables secured
- [ ] No sensitive data in logs
- [ ] CORS properly configured
- [ ] Dependencies updated and audited

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build
   ```

2. **CORS Issues**
   - Check FRONTEND_URL environment variable
   - Verify CORS configuration in backend

3. **API Connection Issues**
   - Verify NEXT_PUBLIC_API_URL
   - Check network connectivity
   - Review proxy configuration

4. **Memory Issues**
   - Increase container memory limits
   - Optimize bundle size
   - Enable gzip compression

### Logs Analysis
```bash
# Backend logs
docker logs smarttatkal-backend

# Frontend logs  
docker logs smarttatkal-frontend

# Kubernetes logs
kubectl logs deployment/smarttatkal-backend
kubectl logs deployment/smarttatkal-frontend
```

## 📈 Performance Optimization

1. **Frontend**
   - Enable Next.js Image Optimization
   - Implement code splitting
   - Use CDN for static assets
   - Enable compression

2. **Backend**
   - Implement caching (Redis)
   - Database connection pooling
   - API response compression
   - Load balancing

3. **Infrastructure**
   - Auto-scaling configuration
   - CDN setup
   - Database optimization
   - Monitoring and alerting

---

For additional support, check the main [README.md](README.md) or open an issue on GitHub.