using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers.Admin
{
    /// <summary>
    /// Base controller for all Admin API endpoints
    /// All admin endpoints require Admin role authorization
    /// Route pattern: api/admin/{controller}
    /// </summary>
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public abstract class AdminBaseController : BaseApiController
    {
    }
}
